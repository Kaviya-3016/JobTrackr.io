import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { queryAll, queryOne, execute } from '../db/index.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /interviews
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const interviews = queryAll(`
      SELECT 
        i.*,
        ja.company_name,
        ja.role_applied,
        COALESCE(i.location, ja.job_location) as job_location,
        COALESCE(i.resume_used_id, ja.resume_used_id) as resume_used_id,
        r.resume_name,
        r.file_url as resume_file_url,
        rf.id as feedback_id,
        rf.rejection_reason,
        rf.detailed_notes as feedback_notes,
        rf.improvement_suggestions
      FROM interviews i
      JOIN job_applications ja ON i.job_application_id = ja.id
      LEFT JOIN resumes r ON r.id = COALESCE(i.resume_used_id, ja.resume_used_id)
      LEFT JOIN rejections_feedback rf ON rf.interview_id = i.id
      WHERE ja.user_id = ?
      ORDER BY i.interview_date DESC
    `, [userId]);

    res.json({ interviews });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /interviews
router.post('/', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      job_application_id,
      company_name,
      role_applied,
      location,
      job_location,
      interview_date,
      interview_type = 'Virtual',
      interview_status = 'Scheduled',
      is_walk_in = false,
      walk_in_details,
      round_name = 'Technical Round',
      resume_used_id,
      notes
    } = req.body;

    if ((!job_application_id && !company_name) || !interview_date) {
      res.status(400).json({ error: 'Company name and interview date are required' });
      return;
    }

    const compName = (company_name || job_application_id || '').trim();
    const role = (role_applied || round_name || 'Software Engineer').trim();
    const loc = (location || job_location || 'Not Specified').trim();

    // Verify application belongs to user or resolve by company name
    let finalAppId = job_application_id;
    let app = finalAppId ? queryOne<{ id: string }>('SELECT id FROM job_applications WHERE id = ? AND user_id = ?', [finalAppId, userId]) : null;

    if (!app && compName) {
      app = queryOne<{ id: string }>('SELECT id FROM job_applications WHERE user_id = ? AND LOWER(company_name) = LOWER(?)', [userId, compName]);
      if (app) {
        finalAppId = app.id;
        // Optionally update location / role / resume if missing
        if (resume_used_id) {
          execute('UPDATE job_applications SET resume_used_id = COALESCE(resume_used_id, ?) WHERE id = ?', [resume_used_id, app.id]);
        }
      } else {
        const newAppId = uuidv4();
        const maxSNo = queryOne<{ max_s: number }>('SELECT COALESCE(MAX(s_no), 0) as max_s FROM job_applications WHERE user_id = ?', [userId]);
        const sNo = (maxSNo?.max_s || 0) + 1;
        execute(`
          INSERT INTO job_applications (id, user_id, s_no, company_name, role_applied, job_location, job_portal, application_date, resume_used_id, application_status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          newAppId,
          userId,
          sNo,
          compName,
          role,
          loc,
          is_walk_in ? 'Walk-in Drive' : 'Direct Interview',
          interview_date,
          resume_used_id || null,
          interview_status === 'Scheduled' || interview_status === 'Rescheduled' ? 'Interview Scheduled' : 'Applied'
        ]);
        finalAppId = newAppId;
      }
    }

    const id = uuidv4();
    execute(`
      INSERT INTO interviews (
        id, job_application_id, interview_date, interview_type,
        interview_status, is_walk_in, walk_in_details, round_name, notes, resume_used_id, location
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, finalAppId, interview_date, interview_type,
      interview_status, is_walk_in ? 1 : 0, walk_in_details || null,
      round_name, notes || null, resume_used_id || null, loc || null
    ]);

    // Also update application status if relevant
    if (interview_status === 'Scheduled' || interview_status === 'Rescheduled') {
      execute("UPDATE job_applications SET application_status = 'Interview Scheduled', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [finalAppId]);
    } else if (interview_status === 'Offer' || interview_status.includes('Offer')) {
      execute("UPDATE job_applications SET application_status = 'Offer', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [finalAppId]);
    }

    const created = queryOne(`
      SELECT 
        i.*,
        ja.company_name,
        ja.role_applied,
        COALESCE(i.location, ja.job_location) as job_location,
        COALESCE(i.resume_used_id, ja.resume_used_id) as resume_used_id,
        r.resume_name,
        r.file_url as resume_file_url
      FROM interviews i 
      JOIN job_applications ja ON i.job_application_id = ja.id 
      LEFT JOIN resumes r ON r.id = COALESCE(i.resume_used_id, ja.resume_used_id)
      WHERE i.id = ?
    `, [id]);

    res.status(201).json({ message: 'Interview logged successfully', interview: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /interviews/:id
router.patch('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = queryOne(`
      SELECT i.*, ja.user_id FROM interviews i
      JOIN job_applications ja ON i.job_application_id = ja.id
      WHERE i.id = ? AND ja.user_id = ?
    `, [id, userId]);

    if (!existing) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }

    const {
      company_name,
      role_applied,
      location,
      job_location,
      interview_date,
      interview_type,
      interview_status,
      is_walk_in,
      walk_in_details,
      round_name,
      resume_used_id,
      notes
    } = req.body;

    const loc = location || job_location;

    execute(`
      UPDATE interviews
      SET 
        interview_date = COALESCE(?, interview_date),
        interview_type = COALESCE(?, interview_type),
        interview_status = COALESCE(?, interview_status),
        is_walk_in = COALESCE(?, is_walk_in),
        walk_in_details = COALESCE(?, walk_in_details),
        round_name = COALESCE(?, round_name),
        notes = COALESCE(?, notes),
        resume_used_id = COALESCE(?, resume_used_id),
        location = COALESCE(?, location)
      WHERE id = ?
    `, [
      interview_date !== undefined ? interview_date : null,
      interview_type !== undefined ? interview_type : null,
      interview_status !== undefined ? interview_status : null,
      is_walk_in !== undefined ? (is_walk_in ? 1 : 0) : null,
      walk_in_details !== undefined ? walk_in_details : null,
      round_name !== undefined ? round_name : null,
      notes !== undefined ? notes : null,
      resume_used_id !== undefined ? resume_used_id : null,
      loc !== undefined ? loc : null,
      id
    ]);

    // Update parent job application details if provided
    if (company_name || role_applied || loc) {
      execute(`
        UPDATE job_applications
        SET 
          company_name = COALESCE(?, company_name),
          role_applied = COALESCE(?, role_applied),
          job_location = COALESCE(?, job_location),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        company_name || null,
        role_applied || null,
        loc || null,
        existing.job_application_id
      ]);
    }

    // Update parent job application status if interview result changed
    if (interview_status === 'Offer' || (interview_status && interview_status.includes('Offer'))) {
      execute("UPDATE job_applications SET application_status = 'Offer' WHERE id = ?", [existing.job_application_id]);
    } else if (interview_status === 'Rejected') {
      execute("UPDATE job_applications SET application_status = 'Rejected' WHERE id = ?", [existing.job_application_id]);
    }

    const updated = queryOne(`
      SELECT 
        i.*,
        ja.company_name,
        ja.role_applied,
        COALESCE(i.location, ja.job_location) as job_location,
        COALESCE(i.resume_used_id, ja.resume_used_id) as resume_used_id,
        r.resume_name,
        r.file_url as resume_file_url
      FROM interviews i 
      JOIN job_applications ja ON i.job_application_id = ja.id 
      LEFT JOIN resumes r ON r.id = COALESCE(i.resume_used_id, ja.resume_used_id)
      WHERE i.id = ?
    `, [id]);

    res.json({ message: 'Interview updated', interview: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /interviews/:id/feedback - Add rejection feedback
router.post('/:id/feedback', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rejection_reason, detailed_notes, improvement_suggestions } = req.body;

    // Check if feedback already exists for this interview
    const existing = queryOne('SELECT id FROM rejections_feedback WHERE interview_id = ?', [id]);
    if (existing) {
      execute(`
        UPDATE rejections_feedback
        SET rejection_reason = ?, detailed_notes = ?, improvement_suggestions = ?
        WHERE id = ?
      `, [rejection_reason, detailed_notes, improvement_suggestions, existing.id]);
    } else {
      execute(`
        INSERT INTO rejections_feedback (id, interview_id, rejection_reason, detailed_notes, improvement_suggestions)
        VALUES (?, ?, ?, ?, ?)
      `, [uuidv4(), id, rejection_reason, detailed_notes, improvement_suggestions]);
    }

    // Also ensure interview status is set to Rejected
    execute("UPDATE interviews SET interview_status = 'Rejected' WHERE id = ?", [id]);

    res.json({ message: 'Rejection feedback recorded successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /interviews/:id
router.delete('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const existing = queryOne(`
      SELECT i.id FROM interviews i
      JOIN job_applications ja ON i.job_application_id = ja.id
      WHERE i.id = ? AND ja.user_id = ?
    `, [id, userId]);

    if (!existing) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }

    execute('DELETE FROM interviews WHERE id = ?', [id]);
    res.json({ message: 'Interview deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
