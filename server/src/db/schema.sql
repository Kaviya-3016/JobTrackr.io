-- Enable UUID extension if in PostgreSQL / Supabase
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT DEFAULT 'Kavi',
  phone TEXT DEFAULT '+91-7418082136',
  portfolio TEXT DEFAULT 'https://github.com/Kaviya-3016',
  bio TEXT DEFAULT 'Graduate (2026) in ECE with 8.1 CGPA | Aspiring Software Engineer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resumes Table (created before job_applications for foreign key)
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  ats_score INT DEFAULT 75,
  is_active BOOLEAN DEFAULT FALSE,
  uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  s_no INT NOT NULL,
  company_name TEXT NOT NULL,
  role_applied TEXT NOT NULL,
  job_location TEXT NOT NULL,
  job_portal TEXT NOT NULL,
  application_date DATE NOT NULL,
  resume_used_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  reply_status TEXT CHECK (reply_status IN ('No Reply', 'Replied')) DEFAULT 'No Reply',
  application_status TEXT CHECK (application_status IN ('Applied', 'In Progress', 'Rejected', 'Interview Scheduled', 'Offer')) DEFAULT 'Applied',
  notes TEXT,
  salary_range TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  interview_date DATE NOT NULL,
  interview_type TEXT DEFAULT 'Virtual',
  interview_status TEXT DEFAULT 'Scheduled',
  is_walk_in BOOLEAN DEFAULT FALSE,
  walk_in_details TEXT,
  round_name TEXT DEFAULT 'Technical Round 1',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rejections Feedback Table
CREATE TABLE IF NOT EXISTS rejections_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  rejection_reason TEXT,
  detailed_notes TEXT,
  improvement_suggestions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Waitlist Jobs Table
CREATE TABLE IF NOT EXISTS waitlist_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  job_url TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('Wishlist', 'Applied', 'Completed')) DEFAULT 'Wishlist',
  salary_expectation TEXT,
  added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_date ON job_applications(application_date);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_interviews_application_id ON interviews(job_application_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_user_id ON waitlist_jobs(user_id);
