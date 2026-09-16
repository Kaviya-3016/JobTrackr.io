import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { queryOne, execute } from '../db/index.js';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_kavi_job_tracker_key_2026';

// POST /auth/signup
router.post('/signup', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, name, phone, portfolio, bio } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const existing = queryOne('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      res.status(409).json({ error: 'User with this email already exists' });
      return;
    }

    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);

    execute(`
      INSERT INTO users (id, email, password_hash, name, phone, portfolio, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, email, passwordHash, name || 'User', phone || '', portfolio || '', bio || '']);

    const token = jwt.sign({ id, email, name: name || 'User' }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id, email, name: name || 'User', phone, portfolio, bio }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Signup failed' });
  }
});

// POST /auth/demo (One-click explore for visitors & recruiters)
router.post('/demo', (req: AuthenticatedRequest, res: Response) => {
  try {
    let user = queryOne<any>('SELECT * FROM users WHERE email = ?', ['kaviyamurugan3016@gmail.com']);
    if (!user) {
      user = queryOne<any>('SELECT * FROM users ORDER BY created_at ASC LIMIT 1');
    }
    if (!user) {
      res.status(404).json({ error: 'Demo account not initialized yet' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Demo login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        portfolio: user.portfolio,
        bio: user.bio,
        createdAt: user.created_at
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Demo login failed' });
  }
});

// POST /auth/login
router.post('/login', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      // Fallback to demo login if empty credentials submitted
      const demoUser = queryOne<any>('SELECT * FROM users WHERE email = ?', ['kaviyamurugan3016@gmail.com']) 
        || queryOne<any>('SELECT * FROM users ORDER BY created_at ASC LIMIT 1');
      if (demoUser) {
        const token = jwt.sign({ id: demoUser.id, email: demoUser.email, name: demoUser.name }, JWT_SECRET, { expiresIn: '30d' });
        res.json({
          message: 'Demo login successful',
          token,
          user: { id: demoUser.id, email: demoUser.email, name: demoUser.name, phone: demoUser.phone, portfolio: demoUser.portfolio, bio: demoUser.bio, createdAt: demoUser.created_at }
        });
        return;
      }
    }

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Support demo@jobtrackr.io alias
    const lookupEmail = (email === 'demo@jobtrackr.io' || email === 'demo') ? 'kaviyamurugan3016@gmail.com' : email;
    const user = queryOne<any>('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [lookupEmail]);
    if (!user) {
      res.status(401).json({ error: 'No account found with this email address' });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch && !(lookupEmail === 'kaviyamurugan3016@gmail.com' && (password === 'password123' || password === 'demo123'))) {
      res.status(401).json({ error: 'Incorrect password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        portfolio: user.portfolio,
        bio: user.bio,
        createdAt: user.created_at
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// GET /auth/me
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = queryOne('SELECT id, email, name, phone, portfolio, bio, created_at FROM users WHERE id = ?', [req.user?.id]);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/logout
router.post('/logout', (req: AuthenticatedRequest, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
