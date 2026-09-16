# JobTrackr.io 🚀

> **Track Every Application. Crack Every Interview. Land Your Dream Role.**

A free and open-source career intelligence cockpit designed for ambitious job hunters across all fields and roles. JobTrackr.io transforms chaotic job hunting into a data-driven, organized process.

[![GitHub Stars](https://img.shields.io/github/stars/Kaviya-3016/JobTrackr.io)](https://github.com/Kaviya-3016/JobTrackr.io)
[![Status](https://img.shields.io/badge/status-Active-success)]()
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🎯 Why JobTrackr.io?

No spreadsheets. No messy bookmarks. No lost follow-ups.

Managing your job search across multiple portals (LinkedIn, Naukri, Wellfound, Direct company portals) is exhausting. JobTrackr.io gives you an **unfair advantage** in today's competitive job market by centralizing everything into one unified, intelligent career platform.

---

## 📸 Screenshots & Visual Tour

### 1. Landing Page & Hero Section
*Clean, high-energy interface with responsive light/dark themes, fast authentication, and instant onboarding.*

![JobTrackr.io Landing Page](docs/screenshots/homepage-hero.png)

---

### 2. Built for High Performance — Feature Highlights
*Comprehensive feature suite eliminating messy spreadsheets, lost follow-ups, and fragmented resumes.*

![JobTrackr.io Features Overview](docs/screenshots/features-overview.png)

---

### 3. Career Analytics Dashboard & Activity Heatmap
*Executive cockpit showcasing total applications, reply accuracy rates, interview conversions, status donut breakdowns, and platform volume charts.*

![JobTrackr.io Analytics Dashboard](docs/screenshots/analytics-dashboard.png)

---

### 4. Job Applications Directory
*Centralized directory with auto-incrementing sequential numbers (#S.No), multi-portal filtering, search, reply tracking, and quick actions.*

![JobTrackr.io Applications Directory](docs/screenshots/applications-directory.png)

---

### 5. Detailed Application & Walk-in Logger
*Log comprehensive application metadata including role, company, salary/stipend expectations, interview notes, and in-person walk-in drive venue contacts.*

<p align="center">
  <img src="docs/screenshots/log-application-modal.png" alt="Log New Job Application Modal" width="600" />
</p>

---

## 🛠️ Technology Stack

### Frontend Architecture
* **Core Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) for strict type safety and component-driven architecture.
* **Build Tool & Bundler**: [Vite 6](https://vitejs.dev/) with lightning-fast Hot Module Replacement (HMR) and optimized rollup chunks.
* **Styling & Design System**:
  * [Tailwind CSS](https://tailwindcss.com/) with curated neon gradients, sleek dark theme (`#120824`), and glassmorphism.
  * [PostCSS](https://postcss.org/) & [Autoprefixer](https://github.com/postcss/autoprefixer).
  * `clsx` & `tailwind-merge` for clean conditional class composition.
* **Iconography**: [Lucide React](https://lucide.dev/) (consistent vector icon set).
* **Data Visualization & Charts**:
  * [Recharts](https://recharts.org/) for application trend lines, portal response bar graphs, and status donut charts.
  * Custom 365-day SVG application consistency matrix (GitHub-style activity heatmap).
* **Date Utilities**: [date-fns](https://date-fns.org/) for timeline formatting, active streak calculations, and velocity metrics.

### Backend Architecture
* **Server Runtime**: [Node.js](https://nodejs.org/) (ES Modules).
* **API Framework**: [Express.js](https://expressjs.com/) with TypeScript for REST API routing, request validation, and modular controllers.
* **Development Engine**: [tsx](https://github.com/privatenumber/tsx) for zero-config TypeScript execution and hot reloading (`tsx watch`).
* **Security & Middleware**: [CORS](https://www.npmjs.com/package/cors) for secure cross-origin resource sharing, and [dotenv](https://www.npmjs.com/package/dotenv) for environment variable configuration.

### Database & Storage (Dual-Engine Architecture)
JobTrackr.io features a plug-and-play dual database engine:
* **Local Mode (Default / Zero-Config)**: 
  * [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for high-performance, embedded, file-based relational storage with automated schema creation and realistic data seeding.
* **Cloud Mode (Optional)**:
  * [Supabase](https://supabase.com/) ([@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js)) for hosted PostgreSQL, cloud auth rules, and cloud object storage.

### Authentication & Cryptography
* **Authentication Tokens**: [JSON Web Tokens (JWT)](https://jwt.io/) ([`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken)) with 30-day session expiry.
* **Password Security**: [bcryptjs](https://www.npmjs.com/package/bcryptjs) with one-way salted hashing.
* **Key Generation**: [uuid](https://www.npmjs.com/package/uuid) (`v4`) for universally unique record identification.

### Document Generation & File Handling
* **Resume Uploads**: [Multer](https://github.com/expressjs/multer) for multi-part file processing (`.pdf`, `.docx`, `.txt`).
* **Client-Side Document Export**:
  * [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable) for client-side generated, beautifully styled PDF executive reports.
  * Native browser Blob/CSV streamer for spreadsheet exports.

### AI & Career Intelligence
* **Cloud AI**: [OpenAI API](https://github.com/openai/openai-node) (`gpt-4o-mini`) for real-time ATS keyword scoring, role matching, and Google XYZ resume bullet refinement.
* **Heuristic Offline Fallback**: Built-in algorithmic fallback logic so keyword scoring and application analytics function 100% offline without requiring an API key.

### DevOps & Deployment
* **Orchestration**: [concurrently](https://www.npmjs.com/package/concurrently) to boot both frontend and backend concurrently in local development (`npm run dev`).
* **Cloud Hosting Configs**:
  * **Frontend**: Configured for [Vercel](https://vercel.com/) via `vercel.json` SPA routing rewrites.
  * **Backend**: Configured for [Render](https://render.com/) via `render.yaml`.
* **Version Control**: Git & [GitHub](https://github.com/Kaviya-3016/JobTrackr.io).

---

## ✨ Core Features

### 📊 **365-Day Contribution Heatmap**
Visualize your daily application consistency just like GitHub commits. Track active streaks, max streaks, and daily submission velocity over the entire year. Stay motivated with visual feedback on your job hunting momentum.

### 🎤 **Interview Retrospectives & STAR Feedback**
Log interview rounds with detailed evaluation notes and constructive feedback following the STAR methodology. Convert rejections into stepping stones by documenting what went well and what needs improvement.

### 📋 **Interview & Walk-in Logger**
Track multi-stage virtual rounds or in-person walk-in drives with:
- Exact venue addresses
- HR contact information
- Reporting times
- Required documentation checklists
- Interview stage sequencing

### 📈 **Response Rate & Portal Analytics**
Discover which job portals give you the best responses:
- LinkedIn vs. Naukri vs. Wellfound vs. Direct applications
- Response rate tracking per portal
- Portal-wise success metrics
- Data-driven decisions on where to focus your efforts

### 📑 **Multi-CV Resume Hub**
Store multiple tailored resumes for different roles and industries. Link specific resumes to each application so you always know which version landed you the interview.

### 📥 **Instant PDF & CSV Export**
Generate beautifully formatted executive PDF reports with:
- Your profile header
- Response rate accuracy metrics
- Interview conversion data
- Structured tables with sequential S.No.
- Raw CSV exports for spreadsheet analysis and custom reporting

---

## 🎮 Dashboard Overview

Your central command center displays:
- **Total Applications**: Track submission count (updated in real time)
- **Reply Rate**: Percentage of applications receiving responses
- **Interviews Scheduled**: Number of confirmed interview rounds (virtual & walk-ins)
- **Job Portals Tracked**: Volume breakdown across job discovery platforms
- **Activity Heatmap**: 365-day visual consistency matrix

---

## 📱 Key Workflows

### 1. **Adding a New Application**
- Company name and role
- Application location
- Job portal (LinkedIn, Naukri, Company Website, etc.)
- Application date
- Resume selection (from Multi-CV Hub)
- Expected salary range / CTC
- Application notes and referral details
- Auto-assigned sequential S.No for tracking

### 2. **Managing Your Wishlist**
- Save target job postings for future applications
- Store direct job URLs and required skill checklists
- Complete job descriptions for interview preparation
- One-click conversion to active application with auto S.No

### 3. **Tracking Applications**
- Filter by company, role, portal, or location
- View reply statuses (No Reply, Replied)
- Application status tracking (Applied, In Progress, Interview Scheduled, Offer, Rejected)
- Edit, duplicate, or delete entries
- Filter by pipeline stage pills

### 4. **Exporting Results**
- Generate professional PDF reports with custom date ranges
- Export CSV files for personal records and analytics
- Response KPI summaries
- Interview conversion tracking

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

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v22/v24)
- npm 9+
- Modern web browser

### Local Development

```bash
# Clone the repository
git clone https://github.com/Kaviya-3016/JobTrackr.io.git
cd JobTrackr.io

# Install all dependencies (root, client, and server)
npm run install:all

# Start both frontend and backend concurrently
npm run dev

# Client runs on: http://localhost:5173
# Server runs on: http://localhost:5000

# Build for production
npm run build
```

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

> **Note**: If `SUPABASE_URL` and `OPENAI_API_KEY` are left blank, JobTrackr.io automatically runs completely offline on the embedded SQLite database with local heuristic AI.

---

## 📊 User Benefits

✅ **Save Time**: No more switching between spreadsheets and bookmarks  
✅ **Stay Organized**: Single source of truth for all applications  
✅ **Track Metrics**: Reply rates, interview success rates, portal performance  
✅ **Learn & Improve**: Interview feedback logs help you iterate  
✅ **Export Anywhere**: PDFs and CSVs for offline analysis  
✅ **Free Forever**: 100% free and open-source under MIT License  

---

## 🤝 Contributing to JobTrackr.io

JobTrackr.io is built by developers, for developers and all job seekers. We welcome contributions from the community!

### Ways to Contribute

- **Fix Bugs**: Report issues and submit pull requests
- **Suggest Features**: Open an issue with your feature request
- **Improve Documentation**: Help us improve our docs
- **Enhance UI/UX**: Design improvements and new themes
- **Build Integrations**: Connect with other job platforms
- **Showcase Contributions**: Add your profile to our contributors list

### Getting Started with Development

1. **Fork the repository**: Click "Fork" on GitHub
2. **Clone your fork**: `git clone https://github.com/YOUR-USERNAME/JobTrackr.io.git`
3. **Create a feature branch**: `git checkout -b feature/amazing-feature`
4. **Make your changes**: Commit with clear messages
5. **Push to your fork**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**: Describe your changes in detail

---

## 👥 Built With ❤️ By

**Kaviya M** - Creator & Maintainer  
🔗 [GitHub](https://github.com/Kaviya-3016) | 📧 [kaviyamurugan3016@gmail.com](mailto:kaviyamurugan3016@gmail.com)

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Ready to transform your job hunt?**

• 💻 [View on GitHub](https://github.com/Kaviya-3016/JobTrackr.io) • 🤝 [Contribute](CONTRIBUTING.md)

---

*"Track. Learn. Succeed. 🚀"*
