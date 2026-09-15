# JobTrackr.io - Career & Job Application Intelligence Web App

> **Tailored for Kavi** (B.E. ECE 2026 Batch • Software Developer Intern at Shared Box Chess Private Limited)  
> Full-Stack Job Application Tracker with AI ATS Scoring, 365-Day GitHub Contribution Heatmap, Response Rate Analytics, Interview & Walk-in Logging, and Executive PDF/CSV Reports.

---

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, jsPDF + autoTable, Vite
- **Backend**: Node.js, Express, TypeScript (ESM)
- **Database & Storage**: 
  - **Dual Engine**: Plug-and-play **Supabase (PostgreSQL + Auth + Storage)** or immediate local embedded **SQLite** with automated schema migrations and pre-seeded realistic data.
- **AI Engine**: 
  - **OpenAI API (`gpt-4o-mini`)** for live ATS scoring, keyword matching, FAANG resume feedback (Google XYZ formula), role recommendations, and rejection pattern analysis.
  - Built-in heuristic fallback engine ensuring 100% functionality without requiring an API key.
- **Deployment**: Configured for **Vercel** (Frontend) and **Render** (Backend).

---

## 🌟 Key Features

### Phase 1 - Core Tracking & Directory
- **Auto-Incrementing S.No**: Each user's job applications are automatically assigned their own sequential S.No starting from 1.
- **Full CRUD Application Table**: Company name, role applied, location, portal (LinkedIn, Naukri, Wellfound, Careers, etc.), application date, attached resume version, reply status (`No Reply` / `Replied`), application status (`Applied`, `In Progress`, `Interview Scheduled`, `Offer`, `Rejected`), salary/stipend, and referral notes.
- **Real-time Filters**: Search by company/role, filter by portal, filter by reply status, and filter by status pills.

### Phase 2 - Advanced Analytics & 365-Day Heatmap
- **365-Day GitHub Heatmap**: 52-week contribution grid visualizing daily application volume, streak tracking (current & max streak), and color intensity scaling.
- **Daily Trend Line Chart**: Area chart showing application velocity over the last 60 days.
- **Weekly & Monthly Velocity**: Grouped bar charts comparing total applications vs responses vs offers.
- **Reply Accuracy Rate**: `(replies received / total applications) * 100` calculated overall and broken down per job portal.
- **Interview Success Rate**: `(offers / attended interviews) * 100` with virtual vs in-person walk-in breakdown.

### Phase 3 - Resume Database & AI Career Advisor
- **Resume Hub**: Upload multiple resume versions (PDF, DOCX), designate your active CV, and preview files.
- **ATS Keyword Scorer**: Scan any resume against target job descriptions to get an ATS compatibility score (0-100), grade (A+, A, B+), matched keywords, and missing keywords with one-click copy.
- **FAANG Resume Feedback**: Before & after bullet point critiques using Google's XYZ formula (*"Accomplished X by doing Y as measured by Z"*).
- **Smart Role Recommendations**: Analyzes applied roles and technical background to recommend high-conversion positions with match probability % and salary expectations.
- **Rejection Pattern Analysis**: Identifies technical interview gaps and generates actionable preparation steps.

### Phase 4 - Interviews, Wishlist & Reports
- **Interviews & Walk-in Tracker**: Track interview rounds, statuses, and dedicated in-person walk-in venue details (venue address, HR contact person, documents required).
- **Constructive Rejection Logging**: Record rejection reasons, feedback notes, and get AI suggestions.
- **Wishlist / Apply Later Queue**: Save target companies and roles with one-click conversion to active applications with auto S.No.
- **Export Center**: Download filtered data as CSV spreadsheets or multi-page executive PDF reports.

---

## 📁 Database Schema

```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT DEFAULT 'Kavi',
  phone TEXT DEFAULT '+91-7418082136',
  portfolio TEXT DEFAULT 'https://github.com/Kaviya-3016',
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- resumes table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  ats_score INT DEFAULT 75,
  is_active BOOLEAN DEFAULT FALSE,
  uploaded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- job_applications table
CREATE TABLE job_applications (
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

-- interviews table
CREATE TABLE interviews (
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

-- rejections_feedback table
CREATE TABLE rejections_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
  rejection_reason TEXT,
  detailed_notes TEXT,
  improvement_suggestions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- waitlist_jobs table
CREATE TABLE waitlist_jobs (
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
```

---

## 🏃 Local Setup & Running

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### Quick Start (Both Servers)

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Start Backend Server**:
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Start Frontend Client**:
   ```bash
   cd client
   npm run dev
   # Client runs on http://localhost:5173
   ```

4. Open your browser and navigate to **`http://localhost:5173/`**.

---

## 🔑 Environment Configuration

In `server/.env`:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_kavi_job_tracker_key_2026

# Optional: Remote Supabase Connection
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: OpenAI API Key for Live GPT-4o-mini Analysis
OPENAI_API_KEY=sk-...
```

*Note: If `SUPABASE_URL` and `OPENAI_API_KEY` are left blank, the app runs completely offline on the embedded SQLite database with local heuristic AI.*
