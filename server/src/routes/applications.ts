import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, execute } from '../db/index.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /applications (with search, status, portal, date filters)
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, portal, reply, search, fromDate, toDate, sort = 'desc' } = req.query;

    let sql = `
      SELECT 
        ja.*,
        r.resume_name,
        r.ats_score as resume_ats_score
      FROM job_applications ja
      LEFT JOIN resumes r ON ja.resume_used_id = r.id
      WHERE ja.user_id = ?
    `;
    const params: any[] = [userId];

    if (status && status !== 'All') {
      sql += ` AND ja.application_status = ?`;
      params.push(status);
    }

    if (portal && portal !== 'All') {
      sql += ` AND ja.job_portal = ?`;
      params.push(portal);
    }

    if (reply && reply !== 'All') {
      sql += ` AND ja.reply_status = ?`;
      params.push(reply);
    }

    if (fromDate) {
      sql += ` AND ja.application_date >= ?`;
      params.push(fromDate);
    }

    if (toDate) {
      sql += ` AND ja.application_date <= ?`;
      params.push(toDate);
    }

    if (search) {
      sql += ` AND (ja.company_name LIKE ? OR ja.role_applied LIKE ? OR ja.job_location LIKE ?)`;
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const sortOrder = sort === 'asc' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ja.s_no ${sortOrder}`;

    const applications = queryAll(sql, params);
    res.json({ count: applications.length, applications });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch applications' });
  }
});

// GET /applications/:id
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const application = queryOne(`
      SELECT 
        ja.*,
        r.resume_name,
        r.ats_score as resume_ats_score
      FROM job_applications ja
      LEFT JOIN resumes r ON ja.resume_used_id = r.id
      WHERE ja.id = ? AND ja.user_id = ?
    `, [id, userId]);

    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    // Also fetch any attached interviews
    const interviews = queryAll(`
      SELECT * FROM interviews WHERE job_application_id = ? ORDER BY interview_date ASC
    `, [id]);

    res.json({ application, interviews });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /applications - Auto-increments S.No per user
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      company_name,
      role_applied,
      job_location,
      job_portal,
      application_date,
      resume_used_id,
      reply_status = 'No Reply',
      application_status = 'Applied',
      notes,
      salary_range
    } = req.body;

    if (!company_name || !role_applied) {
      res.status(400).json({ error: 'Company name and role are required' });
      return;
    }

    // Auto-calculate S.No: per user sequential numbering starting at 1
    const maxRecord = queryOne<{ next_s_no: number }>(`
      SELECT COALESCE(MAX(s_no), 0) + 1 AS next_s_no 
      FROM job_applications 
      WHERE user_id = ?
    `, [userId]);

    const s_no = maxRecord ? maxRecord.next_s_no : 1;
    const id = uuidv4();
    const appDate = application_date || new Date().toISOString().split('T')[0];

    // If resume_used_id wasn't specified, check if user has an active resume
    let finalResumeId = resume_used_id || null;
    if (!finalResumeId) {
      const activeResume = queryOne('SELECT id FROM resumes WHERE user_id = ? AND is_active = 1 LIMIT 1', [userId]);
      if (activeResume) {
        finalResumeId = activeResume.id;
      }
    }

    execute(`
      INSERT INTO job_applications (
        id, user_id, s_no, company_name, role_applied, job_location,
        job_portal, application_date, resume_used_id, reply_status,
        application_status, notes, salary_range
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, userId, s_no, company_name.trim(), role_applied.trim(),
      (job_location || 'Remote').trim(), (job_portal || 'LinkedIn').trim(),
      appDate, finalResumeId, reply_status, application_status,
      notes || null, salary_range || null
    ]);

    const created = queryOne(`
      SELECT ja.*, r.resume_name 
      FROM job_applications ja
      LEFT JOIN resumes r ON ja.resume_used_id = r.id
      WHERE ja.id = ?
    `, [id]);

    res.status(201).json({ message: 'Application created successfully', application: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create application' });
  }
});

// PATCH /applications/:id
router.patch('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = queryOne('SELECT * FROM job_applications WHERE id = ? AND user_id = ?', [id, userId]);
    if (!existing) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }

    const {
      company_name,
      role_applied,
      job_location,
      job_portal,
      application_date,
      resume_used_id,
      reply_status,
      application_status,
      notes,
      salary_range
    } = req.body;

    execute(`
      UPDATE job_applications
      SET 
        company_name = COALESCE(?, company_name),
        role_applied = COALESCE(?, role_applied),
        job_location = COALESCE(?, job_location),
        job_portal = COALESCE(?, job_portal),
        application_date = COALESCE(?, application_date),
        resume_used_id = COALESCE(?, resume_used_id),
        reply_status = COALESCE(?, reply_status),
        application_status = COALESCE(?, application_status),
        notes = COALESCE(?, notes),
        salary_range = COALESCE(?, salary_range),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `, [
      company_name !== undefined ? company_name : null,
      role_applied !== undefined ? role_applied : null,
      job_location !== undefined ? job_location : null,
      job_portal !== undefined ? job_portal : null,
      application_date !== undefined ? application_date : null,
      resume_used_id !== undefined ? resume_used_id : null,
      reply_status !== undefined ? reply_status : null,
      application_status !== undefined ? application_status : null,
      notes !== undefined ? notes : null,
      salary_range !== undefined ? salary_range : null,
      id, userId
    ]);

    const updated = queryOne(`
      SELECT ja.*, r.resume_name 
      FROM job_applications ja
      LEFT JOIN resumes r ON ja.resume_used_id = r.id
      WHERE ja.id = ?
    `, [id]);

    res.json({ message: 'Application updated successfully', application: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update application' });
  }
});

// DELETE /applications/:id
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const result = execute('DELETE FROM job_applications WHERE id = ? AND user_id = ?', [id, userId]);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Application not found or already deleted' });
      return;
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete application' });
  }
});

export default router;
