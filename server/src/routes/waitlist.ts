import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, execute } from '../db/index.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /waitlist
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const items = queryAll(`
      SELECT * FROM waitlist_jobs WHERE user_id = ? ORDER BY added_date DESC
    `, [userId]);

    res.json({ waitlist: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads/screenshots'));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueName = `screenshot_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (PNG, JPEG, WebP) are allowed for screenshots'));
    }
  },
});

// POST /waitlist/upload-screenshot
router.post('/upload-screenshot', upload.single('screenshot'), (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file uploaded' });
      return;
    }
    const fileUrl = `/uploads/screenshots/${req.file.filename}`;
    res.json({ message: 'Screenshot uploaded successfully', file_url: fileUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Screenshot upload failed' });
  }
});

// POST /waitlist
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      company_name,
      role,
      job_url,
      description,
      screenshot_url,
      links,
      notes,
      status = 'Wishlist',
      salary_expectation
    } = req.body;

    if (!company_name || !role) {
      res.status(400).json({ error: 'Company name and role are required' });
      return;
    }

    const id = uuidv4();
    const linksStr = typeof links === 'object' && links !== null ? JSON.stringify(links) : (links || null);

    execute(`
      INSERT INTO waitlist_jobs (id, user_id, company_name, role, job_url, description, screenshot_url, links, notes, status, salary_expectation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      userId,
      company_name.trim(),
      role.trim(),
      job_url || null,
      description || null,
      screenshot_url || null,
      linksStr,
      notes || null,
      status,
      salary_expectation || null
    ]);

    const created = queryOne('SELECT * FROM waitlist_jobs WHERE id = ?', [id]);
    res.status(201).json({ message: 'Added to wishlist', item: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /waitlist/:id
router.patch('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      company_name,
      role,
      job_url,
      description,
      screenshot_url,
      links,
      notes,
      status,
      salary_expectation
    } = req.body;

    const existing = queryOne('SELECT * FROM waitlist_jobs WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existing) {
      res.status(404).json({ error: 'Wishlist item not found' });
      return;
    }

    const linksStr = links !== undefined ? (typeof links === 'object' && links !== null ? JSON.stringify(links) : links) : null;

    execute(`
      UPDATE waitlist_jobs
      SET 
        company_name = COALESCE(?, company_name),
        role = COALESCE(?, role),
        job_url = COALESCE(?, job_url),
        description = COALESCE(?, description),
        screenshot_url = COALESCE(?, screenshot_url),
        links = COALESCE(?, links),
        notes = COALESCE(?, notes),
        status = COALESCE(?, status),
        salary_expectation = COALESCE(?, salary_expectation)
      WHERE id = ? AND user_id = ?
    `, [
      company_name !== undefined ? company_name : null,
      role !== undefined ? role : null,
      job_url !== undefined ? job_url : null,
      description !== undefined ? description : null,
      screenshot_url !== undefined ? screenshot_url : null,
      linksStr,
      notes !== undefined ? notes : null,
      status !== undefined ? status : null,
      salary_expectation !== undefined ? salary_expectation : null,
      id, userId
    ]);

    const updated = queryOne('SELECT * FROM waitlist_jobs WHERE id = ?', [id]);
    res.json({ message: 'Wishlist item updated', item: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /waitlist/:id/apply - Convert wishlist item to active application
router.post('/:id/apply', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { job_location = 'Remote', job_portal = 'Direct Careers', resume_used_id } = req.body;

    const item = queryOne<{ company_name: string; role: string; notes: string; salary_expectation: string }>(
      'SELECT * FROM waitlist_jobs WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!item) {
      res.status(404).json({ error: 'Wishlist item not found' });
      return;
    }

    // Auto-calculate S.No for new application
    const maxRecord = queryOne<{ next_s_no: number }>(
      'SELECT COALESCE(MAX(s_no), 0) + 1 AS next_s_no FROM job_applications WHERE user_id = ?',
      [userId]
    );
    const s_no = maxRecord ? maxRecord.next_s_no : 1;

    // Check active resume if not provided
    let finalResumeId = resume_used_id || null;
    if (!finalResumeId) {
      const activeResume = queryOne('SELECT id FROM resumes WHERE user_id = ? AND is_active = 1 LIMIT 1', [userId]);
      if (activeResume) finalResumeId = activeResume.id;
    }

    const newAppId = uuidv4();
    const today = new Date().toISOString().split('T')[0];

    execute(`
      INSERT INTO job_applications (
        id, user_id, s_no, company_name, role_applied, job_location,
        job_portal, application_date, resume_used_id, reply_status,
        application_status, notes, salary_range
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'No Reply', 'Applied', ?, ?)
    `, [
      newAppId, userId, s_no, item.company_name, item.role,
      job_location, job_portal, today, finalResumeId,
      item.notes || 'Converted from Wishlist', item.salary_expectation || null
    ]);

    // Update wishlist status to 'Applied'
    execute("UPDATE waitlist_jobs SET status = 'Applied' WHERE id = ?", [id]);

    const createdApp = queryOne('SELECT * FROM job_applications WHERE id = ?', [newAppId]);

    res.json({
      message: 'Successfully converted wishlist item into Job Application #' + s_no,
      application: createdApp
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /waitlist/:id
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const result = execute('DELETE FROM waitlist_jobs WHERE id = ? AND user_id = ?', [id, userId]);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Wishlist item not found' });
      return;
    }

    res.json({ message: 'Wishlist item deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
