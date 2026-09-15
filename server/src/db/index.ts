import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase setup if environment variables exist
export const supabaseUrl = process.env.SUPABASE_URL || '';
export const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Connected to remote Supabase instance.');
  } catch (err) {
    console.warn('Failed to initialize Supabase client, falling back to local SQLite.', err);
  }
}

// Local SQLite database directory & file
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'job_tracker.sqlite');
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize local schema
export function initLocalSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT DEFAULT 'Kavi',
      phone TEXT DEFAULT '+91-7418082136',
      portfolio TEXT DEFAULT 'https://github.com/Kaviya-3016',
      bio TEXT DEFAULT 'Graduate (2026) in ECE with 8.1 CGPA | Aspiring Software Engineer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      resume_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      ats_score INTEGER DEFAULT 78,
      is_active INTEGER DEFAULT 0,
      uploaded_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      s_no INTEGER NOT NULL,
      company_name TEXT NOT NULL,
      role_applied TEXT NOT NULL,
      job_location TEXT NOT NULL,
      job_portal TEXT NOT NULL,
      application_date TEXT NOT NULL,
      resume_used_id TEXT,
      reply_status TEXT DEFAULT 'No Reply',
      application_status TEXT DEFAULT 'Applied',
      notes TEXT,
      salary_range TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (resume_used_id) REFERENCES resumes(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS interviews (
      id TEXT PRIMARY KEY,
      job_application_id TEXT NOT NULL,
      interview_date TEXT NOT NULL,
      interview_type TEXT DEFAULT 'Virtual',
      interview_status TEXT DEFAULT 'Scheduled',
      is_walk_in INTEGER DEFAULT 0,
      walk_in_details TEXT,
      round_name TEXT DEFAULT 'Technical Round 1',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_application_id) REFERENCES job_applications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rejections_feedback (
      id TEXT PRIMARY KEY,
      interview_id TEXT NOT NULL,
      rejection_reason TEXT,
      detailed_notes TEXT,
      improvement_suggestions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS waitlist_jobs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      company_name TEXT NOT NULL,
      role TEXT NOT NULL,
      job_url TEXT,
      description TEXT,
      screenshot_url TEXT,
      links TEXT,
      notes TEXT,
      status TEXT DEFAULT 'Wishlist',
      salary_expectation TEXT,
      added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_apps_user ON job_applications(user_id);
    CREATE INDEX IF NOT EXISTS idx_apps_date ON job_applications(application_date);
    CREATE INDEX IF NOT EXISTS idx_apps_status ON job_applications(application_status);
  `);

  // Idempotent column migrations for waitlist_jobs
  const cols = (db.pragma('table_info(waitlist_jobs)') as Array<{ name: string }>).map(c => c.name);
  if (!cols.includes('description')) db.exec('ALTER TABLE waitlist_jobs ADD COLUMN description TEXT;');
  if (!cols.includes('screenshot_url')) db.exec('ALTER TABLE waitlist_jobs ADD COLUMN screenshot_url TEXT;');
  if (!cols.includes('links')) db.exec('ALTER TABLE waitlist_jobs ADD COLUMN links TEXT;');

  // Idempotent column migrations for interviews
  const ivCols = (db.pragma('table_info(interviews)') as Array<{ name: string }>).map(c => c.name);
  if (!ivCols.includes('resume_used_id')) db.exec('ALTER TABLE interviews ADD COLUMN resume_used_id TEXT;');
  if (!ivCols.includes('location')) db.exec('ALTER TABLE interviews ADD COLUMN location TEXT;');
}

// Helper methods for unified queries
export function queryAll<T = any>(sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  return stmt.all(...params) as T[];
}

export function queryOne<T = any>(sql: string, params: any[] = []): T | undefined {
  const stmt = db.prepare(sql);
  return stmt.get(...params) as T | undefined;
}

export function execute(sql: string, params: any[] = []): Database.RunResult {
  const stmt = db.prepare(sql);
  return stmt.run(...params);
}
