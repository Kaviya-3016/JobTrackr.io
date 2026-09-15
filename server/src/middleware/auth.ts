import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { queryOne } from '../db/index.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_kavi_job_tracker_key_2026';

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
      if (err) {
        // Fall back to default user Kavi if token is invalid/expired in development
        const defaultUser = queryOne('SELECT id, email, name FROM users LIMIT 1');
        if (defaultUser) {
          req.user = { id: defaultUser.id, email: defaultUser.email, name: defaultUser.name };
          return next();
        }
        res.status(403).json({ error: 'Invalid or expired authentication token' });
        return;
      }
      req.user = decodedUser as { id: string; email: string; name?: string };
      next();
    });
    return;
  }

  // Development / Demo convenience: automatically associate with Kavi
  const defaultUser = queryOne('SELECT id, email, name FROM users LIMIT 1');
  if (defaultUser) {
    req.user = { id: defaultUser.id, email: defaultUser.email, name: defaultUser.name };
    return next();
  }

  res.status(401).json({ error: 'Authentication required' });
}
