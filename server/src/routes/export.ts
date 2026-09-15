import { Router, Response } from 'express';
import { queryAll, queryOne } from '../db/index.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /export/csv - Download applications as CSV
router.get('/csv', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fromDate, toDate, status } = req.query;

    let sql = `
      SELECT 
        s_no, company_name, role_applied, job_location, job_portal,
        application_date, reply_status, application_status, salary_range, notes
      FROM job_applications
      WHERE user_id = ?
    `;
    const params: any[] = [userId];

    if (fromDate) {
      sql += ' AND application_date >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      sql += ' AND application_date <= ?';
      params.push(toDate);
    }
    if (status && status !== 'All') {
      sql += ' AND application_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY s_no ASC';

    const rows = queryAll(sql, params);

    // Build CSV content
    const headers = ['S.No', 'Company Name', 'Role Applied', 'Location', 'Job Portal', 'Application Date', 'Reply Status', 'Application Status', 'Salary Range', 'Notes'];
    const csvRows = [headers.join(',')];

    for (const row of rows) {
      const escape = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;
      csvRows.push([
        row.s_no,
        escape(row.company_name),
        escape(row.role_applied),
        escape(row.job_location),
        escape(row.job_portal),
        row.application_date,
        escape(row.reply_status),
        escape(row.application_status),
        escape(row.salary_range),
        escape(row.notes)
      ].join(','));
    }

    const csvData = csvRows.join('\r\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="job_applications_export_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /export/pdf-data - Retrieve aggregated summary and table data for PDF rendering
router.get('/pdf-data', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fromDate, toDate } = req.query;

    let sql = `SELECT * FROM job_applications WHERE user_id = ?`;
    const params: any[] = [userId];

    if (fromDate) {
      sql += ' AND application_date >= ?';
      params.push(fromDate);
    }
    if (toDate) {
      sql += ' AND application_date <= ?';
      params.push(toDate);
    }
    sql += ' ORDER BY s_no ASC';

    const applications = queryAll(sql, params);

    const user = queryOne('SELECT name, email, phone, portfolio, bio FROM users WHERE id = ?', [userId]);

    const total = applications.length;
    const replied = applications.filter(a => a.reply_status === 'Replied').length;
    const scheduled = applications.filter(a => a.application_status === 'Interview Scheduled').length;
    const offers = applications.filter(a => a.application_status === 'Offer').length;

    res.json({
      user,
      reportGeneratedAt: new Date().toISOString(),
      dateRange: { fromDate: fromDate || 'Beginning', toDate: toDate || 'Present' },
      metrics: {
        totalApplications: total,
        repliesReceived: replied,
        replyRate: total > 0 ? Number(((replied / total) * 100).toFixed(1)) : 0,
        interviewsScheduled: scheduled,
        offersReceived: offers
      },
      applications
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
