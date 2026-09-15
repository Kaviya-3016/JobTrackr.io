import { Router, Response } from 'express';
import { queryAll } from '../db/index.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';

const router = Router();
router.use(authenticateToken);

// POST /ai/ats-analysis
router.post('/ats-analysis', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resumeText, jobDescription } = req.body;

    const defaultResume = `
Kavi
Email: kaviyamurugan3016@gmail.com | Phone: +91-7418082136 | Portfolio: https://github.com/Kaviya-3016
Education: B.E. Electronics and Communication Engineering (2022-2026), CGPA: 8.1 / 10.0
Work Experience: Full-Stack Web Platform Development (React, TypeScript, Node.js, Express, WebSocket, State Management, REST APIs, Tailwind CSS)
Projects:
1. Real-time Multiplayer Web Application (React, Node.js, WebSockets, Canvas)
2. Job Application Tracking Web Application (React, TypeScript, Express, Supabase PostgreSQL, Recharts, OpenAI)
Technical Skills: JavaScript (ES6+), TypeScript, React.js, Node.js, Express.js, PostgreSQL, Git, Tailwind CSS, Python, C++, Data Structures & Algorithms
    `;

    const textToAnalyze = resumeText || defaultResume;
    const result = await AIService.analyzeATS(textToAnalyze, jobDescription);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'ATS Analysis failed' });
  }
});

// POST /ai/resume-feedback
router.post('/resume-feedback', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { resumeText } = req.body;
    const defaultResume = `
Full-Stack Software Developer.
- Built responsive user interfaces using React and Tailwind CSS.
- Handled API integration with Express backend and database queries.
- Worked on bug fixes and performance improvements.
    `;

    const result = await AIService.getResumeFeedback(resumeText || defaultResume);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Feedback generation failed' });
  }
});

// POST /ai/role-recommendations
router.post('/role-recommendations', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Get user's application history summary
    const apps = queryAll<{ role_applied: string; company_name: string; application_status: string }>(`
      SELECT role_applied, company_name, application_status 
      FROM job_applications 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 15
    `, [userId]);

    const summary = apps.map(a => `${a.role_applied} at ${a.company_name} (${a.application_status})`).join('; ');
    const recommendations = await AIService.getRoleRecommendations(summary || 'Software Developer, Frontend Engineer, React Developer');

    res.json({ recommendations });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Role recommendations failed' });
  }
});

// POST /ai/rejection-analysis
router.post('/rejection-analysis', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch user's rejection records
    const rejections = queryAll<{ rejection_reason: string; detailed_notes: string }>(`
      SELECT rf.rejection_reason, rf.detailed_notes 
      FROM rejections_feedback rf
      JOIN interviews i ON rf.interview_id = i.id
      JOIN job_applications ja ON i.job_application_id = ja.id
      WHERE ja.user_id = ?
    `, [userId]);

    const reasons = rejections.map(r => r.rejection_reason || r.detailed_notes).filter(Boolean);
    const analysis = await AIService.analyzeRejections(reasons);

    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Rejection analysis failed' });
  }
});

export default router;
