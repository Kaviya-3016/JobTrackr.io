import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, execute } from '../db/index.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';

const router = Router();
router.use(authenticateToken);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads/resumes');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
  }
});

// GET /resumes - List all resumes
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const resumes = queryAll(`
      SELECT * FROM resumes WHERE user_id = ? ORDER BY is_active DESC, uploaded_date DESC
    `, [userId]);

    res.json({ resumes });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /resumes/upload
router.post('/upload', upload.single('resumeFile'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const resumeName = req.body.resume_name || (req.file ? req.file.originalname : 'Resume_' + Date.now());
    const fileUrl = req.file ? `/uploads/resumes/${req.file.filename}` : req.body.file_url || '/uploads/resumes/sample.pdf';

    // Run ATS analysis
    const sampleResumeContent = `
Candidate Name: Kavi
Target: Software Development Engineer / Full Stack Engineer
Education: Bachelor of Engineering in Electronics & Communication Engineering (ECE), 2026 Batch, 8.1 CGPA
Experience: Full-Stack Web Platform & Software Development (React, TypeScript, Node.js, Express, WebSocket, State Management, UI/UX)
Technical Skills: JavaScript, TypeScript, React 18, HTML5, CSS3, Tailwind CSS, Node.js, Express, PostgreSQL, Git, GitHub, RESTful APIs, OOP, Data Structures
Projects:
- Chess Web App: Real-time game room state, move validation, interactive chessboard, responsive controls.
- Personal Job Application Tracker: Full-stack CRUD application with Supabase/PostgreSQL, analytics dashboard, ATS scorer, GitHub heatmap.
    `;

    const atsResult = await AIService.analyzeATS(sampleResumeContent);
    const resumeId = uuidv4();

    execute(`
      INSERT INTO resumes (id, user_id, resume_name, file_url, ats_score, is_active)
      VALUES (?, ?, ?, ?, ?, 0)
    `, [resumeId, userId, resumeName, fileUrl, atsResult.score]);

    const created = queryOne('SELECT * FROM resumes WHERE id = ?', [resumeId]);

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: created,
      atsAnalysis: atsResult
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to upload resume' });
  }
});

// GET /resumes/:id/ats-score
router.get('/:id/ats-score', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const resume = queryOne('SELECT * FROM resumes WHERE id = ? AND user_id = ?', [id, userId]);
    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const sampleContent = `Candidate: Kavi (ECE 2026, 8.1 CGPA). Full-Stack Software Developer. React, TypeScript, Node.js, Express, PostgreSQL, REST APIs.`;
    const analysis = await AIService.analyzeATS(sampleContent);

    // Update the resume's ats_score in DB
    execute('UPDATE resumes SET ats_score = ? WHERE id = ?', [analysis.score, id]);

    res.json({ resume, analysis });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /resumes/:id/active - Set as active resume
router.patch('/:id/active', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // Reset all others to inactive
    execute('UPDATE resumes SET is_active = 0 WHERE user_id = ?', [userId]);
    // Set selected to active
    execute('UPDATE resumes SET is_active = 1 WHERE id = ? AND user_id = ?', [id, userId]);

    const updated = queryOne('SELECT * FROM resumes WHERE id = ?', [id]);
    res.json({ message: 'Active resume updated', resume: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /resumes/:id
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const result = execute('DELETE FROM resumes WHERE id = ? AND user_id = ?', [id, userId]);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
