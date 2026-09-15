import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { initLocalSchema } from './db/index.js';
import { seedDatabase } from './db/seed.js';

import authRoutes from './routes/auth.js';
import applicationsRoutes from './routes/applications.js';
import analyticsRoutes from './routes/analytics.js';
import resumesRoutes from './routes/resumes.js';
import aiRoutes from './routes/ai.js';
import interviewsRoutes from './routes/interviews.js';
import waitlistRoutes from './routes/waitlist.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Seed
initLocalSchema();
seedDatabase();

// Middleware
app.use(cors({
  origin: '*', // Allow local dev & preview origins
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Healthcheck
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Job Application Tracker API is healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Job Application Tracker API is healthy',
    timestamp: new Date().toISOString()
  });
});

// Route registration - Mounted at both /api/* and root /* for maximum compatibility
const routePairs = [
  ['auth', authRoutes],
  ['applications', applicationsRoutes],
  ['analytics', analyticsRoutes],
  ['resumes', resumesRoutes],
  ['ai', aiRoutes],
  ['interviews', interviewsRoutes],
  ['waitlist', waitlistRoutes],
  ['export', exportRoutes]
] as const;

for (const [prefix, router] of routePairs) {
  app.use(`/${prefix}`, router);
  app.use(`/api/${prefix}`, router);
}

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
