import { Router, Response } from 'express';
import { queryAll, queryOne } from '../db/index.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /analytics/overview - Overall KPIs
router.get('/overview', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const totalApps = queryOne<{ count: number }>('SELECT COUNT(*) as count FROM job_applications WHERE user_id = ?', [userId])?.count || 0;
    const repliedApps = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM job_applications WHERE user_id = ? AND reply_status = 'Replied'", [userId])?.count || 0;
    const scheduledInterviews = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM job_applications WHERE user_id = ? AND application_status = 'Interview Scheduled'", [userId])?.count || 0;
    const offers = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM job_applications WHERE user_id = ? AND application_status = 'Offer'", [userId])?.count || 0;
    const inProgress = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM job_applications WHERE user_id = ? AND application_status = 'In Progress'", [userId])?.count || 0;
    const rejected = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM job_applications WHERE user_id = ? AND application_status = 'Rejected'", [userId])?.count || 0;

    const replyAccuracy = totalApps > 0 ? Number(((repliedApps / totalApps) * 100).toFixed(1)) : 0;

    // Interview stats
    const totalInterviews = queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM interviews i 
      JOIN job_applications ja ON i.job_application_id = ja.id 
      WHERE ja.user_id = ?
    `, [userId])?.count || 0;

    const attendedInterviews = queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM interviews i 
      JOIN job_applications ja ON i.job_application_id = ja.id 
      WHERE ja.user_id = ? AND i.interview_status IN ('Attended', 'Offer', 'Rejected')
    `, [userId])?.count || 0;

    const offerInterviews = queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM interviews i 
      JOIN job_applications ja ON i.job_application_id = ja.id 
      WHERE ja.user_id = ? AND i.interview_status = 'Offer'
    `, [userId])?.count || 0;

    const interviewSuccessRate = attendedInterviews > 0
      ? Number(((offerInterviews / attendedInterviews) * 100).toFixed(1))
      : (offers > 0 ? 100 : 0);

    // Status breakdown
    const statusBreakdown = queryAll(`
      SELECT application_status as status, COUNT(*) as count 
      FROM job_applications 
      WHERE user_id = ? 
      GROUP BY application_status
    `, [userId]);

    // Portal breakdown
    const portalBreakdown = queryAll(`
      SELECT job_portal as portal, COUNT(*) as count 
      FROM job_applications 
      WHERE user_id = ? 
      GROUP BY job_portal
    `, [userId]);

    res.json({
      totalApplications: totalApps,
      repliedApplications: repliedApps,
      replyAccuracy,
      scheduledInterviews,
      totalInterviews,
      offers,
      inProgress,
      rejected,
      interviewSuccessRate,
      statusBreakdown,
      portalBreakdown
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/daily-count - Line chart trend for the last 45 days
router.get('/daily-count', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { days = 45 } = req.query;

    const rows = queryAll<{ date: string; count: number }>(`
      SELECT application_date as date, COUNT(*) as count
      FROM job_applications
      WHERE user_id = ?
      GROUP BY application_date
      ORDER BY application_date ASC
    `, [userId]);

    res.json({ dailyCounts: rows });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/weekly-summary
router.get('/weekly-summary', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Group by ISO week / year
    const rows = queryAll<{ week: string; count: number; replies: number }>(`
      SELECT 
        strftime('%Y-W%W', application_date) as week,
        COUNT(*) as count,
        SUM(CASE WHEN reply_status = 'Replied' THEN 1 ELSE 0 END) as replies
      FROM job_applications
      WHERE user_id = ?
      GROUP BY strftime('%Y-W%W', application_date)
      ORDER BY week ASC
    `, [userId]);

    const formatted = rows.map(r => ({
      week: r.week,
      total: r.count,
      replies: r.replies,
      replyAccuracy: r.count > 0 ? Number(((r.replies / r.count) * 100).toFixed(1)) : 0
    }));

    res.json({ weeklySummary: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/monthly-summary
router.get('/monthly-summary', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const rows = queryAll<{ month: string; count: number; replies: number; offers: number }>(`
      SELECT 
        strftime('%Y-%m', application_date) as month,
        COUNT(*) as count,
        SUM(CASE WHEN reply_status = 'Replied' THEN 1 ELSE 0 END) as replies,
        SUM(CASE WHEN application_status = 'Offer' THEN 1 ELSE 0 END) as offers
      FROM job_applications
      WHERE user_id = ?
      GROUP BY strftime('%Y-%m', application_date)
      ORDER BY month ASC
    `, [userId]);

    const formatted = rows.map(r => ({
      month: r.month,
      total: r.count,
      replies: r.replies,
      offers: r.offers,
      replyAccuracy: r.count > 0 ? Number(((r.replies / r.count) * 100).toFixed(1)) : 0
    }));

    res.json({ monthlySummary: formatted });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/reply-accuracy - Detailed accuracy breakdown
router.get('/reply-accuracy', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const overall = queryOne<{ total: number; replied: number }>(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN reply_status = 'Replied' THEN 1 ELSE 0 END) as replied
      FROM job_applications
      WHERE user_id = ?
    `, [userId]);

    const total = overall?.total || 0;
    const replied = overall?.replied || 0;
    const overallRate = total > 0 ? Number(((replied / total) * 100).toFixed(1)) : 0;

    // Accuracy per portal
    const byPortal = queryAll(`
      SELECT 
        job_portal as portal,
        COUNT(*) as total,
        SUM(CASE WHEN reply_status = 'Replied' THEN 1 ELSE 0 END) as replied,
        ROUND((SUM(CASE WHEN reply_status = 'Replied' THEN 1.0 ELSE 0 END) / COUNT(*)) * 100, 1) as accuracy_pct
      FROM job_applications
      WHERE user_id = ?
      GROUP BY job_portal
      ORDER BY total DESC
    `, [userId]);

    res.json({
      overallRate,
      totalApplications: total,
      totalReplies: replied,
      portalAccuracy: byPortal
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/interview-stats
router.get('/interview-stats', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const total = queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM interviews i
      JOIN job_applications ja ON i.job_application_id = ja.id
      WHERE ja.user_id = ?
    `, [userId])?.count || 0;

    const attended = queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM interviews i
      JOIN job_applications ja ON i.job_application_id = ja.id
      WHERE ja.user_id = ? AND i.interview_status IN ('Attended', 'Offer', 'Rejected')
    `, [userId])?.count || 0;

    const offers = queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM interviews i
      JOIN job_applications ja ON i.job_application_id = ja.id
      WHERE ja.user_id = ? AND i.interview_status = 'Offer'
    `, [userId])?.count || 0;

    const walkIns = queryOne<{ count: number }>(`
      SELECT COUNT(*) as count FROM interviews i
      JOIN job_applications ja ON i.job_application_id = ja.id
      WHERE ja.user_id = ? AND i.is_walk_in = 1
    `, [userId])?.count || 0;

    const virtuals = total - walkIns;
    const successRate = attended > 0 ? Number(((offers / attended) * 100).toFixed(1)) : (offers > 0 ? 100 : 0);

    res.json({
      totalInterviews: total,
      attendedInterviews: attended,
      offersFromInterviews: offers,
      successRate,
      walkInCount: walkIns,
      virtualCount: virtuals
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /analytics/heatmap-data - GitHub-style 365 days
router.get('/heatmap-data', (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    // Fetch all applications in the last 365 days
    const rows = queryAll<{ date: string; count: number }>(`
      SELECT application_date as date, COUNT(*) as count
      FROM job_applications
      WHERE user_id = ?
      GROUP BY application_date
    `, [userId]);

    const countMap = new Map<string, number>();
    rows.forEach(r => countMap.set(r.date, r.count));

    // Generate 365 calendar days up to today
    const heatmapDays: { date: string; count: number; level: number }[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = countMap.get(dateStr) || 0;

      let level = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count >= 3 && count <= 4) level = 3;
      else if (count >= 5) level = 4;

      heatmapDays.push({ date: dateStr, count, level });
    }

    res.json({
      totalDays: heatmapDays.length,
      days: heatmapDays
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
