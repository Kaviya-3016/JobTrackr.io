import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db, initLocalSchema, queryOne, execute } from './index.js';

export function seedDatabase() {
  initLocalSchema();

  // Check if Kavi's user already exists
  const existingUser = queryOne('SELECT id FROM users WHERE email = ?', ['kaviyamurugan3016@gmail.com']);
  if (existingUser) {
    console.log('Seed: User Kavi already exists. ID:', existingUser.id);
    return existingUser.id;
  }

  console.log('Seeding database with Kavi\'s profile and application records...');

  const userId = uuidv4();
  const passwordHash = bcrypt.hashSync('password123', 10);

  execute(`
    INSERT INTO users (id, email, password_hash, name, phone, portfolio, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    userId,
    'kaviyamurugan3016@gmail.com',
    passwordHash,
    'Kavi',
    '+91-7418082136',
    'https://github.com/Kaviya-3016',
    'Graduate (2026) in ECE with 8.1 CGPA | Aspiring Software Engineer'
  ]);

  // Resumes
  const resume1Id = uuidv4();
  const resume2Id = uuidv4();
  const resume3Id = uuidv4();

  execute(`
    INSERT INTO resumes (id, user_id, resume_name, file_url, ats_score, is_active, uploaded_date)
    VALUES 
    (?, ?, ?, ?, ?, 1, '2026-08-01 10:00:00'),
    (?, ?, ?, ?, ?, 0, '2026-07-15 14:30:00'),
    (?, ?, ?, ?, ?, 0, '2026-06-20 09:15:00')
  `, [
    resume1Id, userId, 'Kavi_SDE_FullStack_2026.pdf', '/uploads/resumes/kavi_sde_resume.pdf', 91,
    resume2Id, userId, 'Kavi_React_Frontend_Developer.pdf', '/uploads/resumes/kavi_frontend_resume.pdf', 84,
    resume3Id, userId, 'Kavi_ECE_Embedded_Systems.pdf', '/uploads/resumes/kavi_ece_resume.pdf', 76
  ]);

  // Realistic applications across the last 3-4 months up to Sep 2026
  const sampleApps = [
    {
      s_no: 1,
      company: 'Shared Box Chess Private Limited',
      role: 'Software Developer Intern',
      location: 'Chennai (Hybrid)',
      portal: 'LinkedIn',
      date: '2026-05-10',
      resumeId: resume1Id,
      reply: 'Replied',
      status: 'Offer',
      notes: 'Internship offer accepted! Working on real-time chess platform full-stack features with React & Node.',
      salary: '₹25,000/month stipend'
    },
    {
      s_no: 2,
      company: 'Zoho Corporation',
      role: 'Software Developer - Campus Hire (2026)',
      location: 'Estancia, Chennai',
      portal: 'Company Careers',
      date: '2026-06-04',
      resumeId: resume1Id,
      reply: 'Replied',
      status: 'Interview Scheduled',
      notes: 'Cleared Level 1 & 2 coding test. Walk-in technical round scheduled at DLF IT Park.',
      salary: '₹6.5 - 8.5 LPA'
    },
    {
      s_no: 3,
      company: 'Freshworks',
      role: 'Associate Software Engineer',
      location: 'Chennai',
      portal: 'LinkedIn',
      date: '2026-06-12',
      resumeId: resume1Id,
      reply: 'Replied',
      status: 'In Progress',
      notes: 'HR called after resume shortlisting. HackerEarth assessment submitted with 100% test cases passed.',
      salary: '₹12 LPA'
    },
    {
      s_no: 4,
      company: 'Microsoft',
      role: 'Software Engineer - New Grad 2026',
      location: 'Bengaluru / Hyderabad',
      portal: 'Company Careers',
      date: '2026-06-25',
      resumeId: resume1Id,
      reply: 'No Reply',
      status: 'Applied',
      notes: 'Referral submitted by Senior SDE. Awaiting interview slot.',
      salary: '₹18 - 24 LPA'
    },
    {
      s_no: 5,
      company: 'Google',
      role: 'Associate Software Engineer (Early Career)',
      location: 'Bengaluru',
      portal: 'Google Careers',
      date: '2026-07-02',
      resumeId: resume1Id,
      reply: 'No Reply',
      status: 'Applied',
      notes: 'Applied for 2026 grad batch via University Portal.',
      salary: '₹22 - 30 LPA'
    },
    {
      s_no: 6,
      company: 'Razorpay',
      role: 'Frontend Engineer I',
      location: 'Bengaluru (Remote)',
      portal: 'Wellfound',
      date: '2026-07-10',
      resumeId: resume2Id,
      reply: 'Replied',
      status: 'Rejected',
      notes: 'Interviewed for React & Web Performance. Needed deeper experience in state machines & high concurrency.',
      salary: '₹14 - 18 LPA'
    },
    {
      s_no: 7,
      company: 'Juspay',
      role: 'Functional Developer (Full Stack)',
      location: 'Bengaluru',
      portal: 'Instahyre',
      date: '2026-07-18',
      resumeId: resume1Id,
      reply: 'Replied',
      status: 'Interview Scheduled',
      notes: 'Hiring challenge cleared! System design & PureScript/Haskell/JS round scheduled next week.',
      salary: '₹15 - 19 LPA'
    },
    {
      s_no: 8,
      company: 'Swiggy',
      role: 'Associate SDE - Web Apps',
      location: 'Bengaluru',
      portal: 'LinkedIn',
      date: '2026-07-26',
      resumeId: resume2Id,
      reply: 'Replied',
      status: 'In Progress',
      notes: 'Take-home assignment on building high-performance cart animation completed and submitted.',
      salary: '₹13 - 16 LPA'
    },
    {
      s_no: 9,
      company: 'PhonePe',
      role: 'Software Engineer - Infrastructure & UI',
      location: 'Bengaluru',
      portal: 'Naukri',
      date: '2026-08-01',
      resumeId: resume1Id,
      reply: 'No Reply',
      status: 'Applied',
      notes: 'Applied via employee referral link.',
      salary: '₹16 - 20 LPA'
    },
    {
      s_no: 10,
      company: 'Chargebee',
      role: 'Full Stack Engineer - Billing Platform',
      location: 'Chennai',
      portal: 'Company Careers',
      date: '2026-08-08',
      resumeId: resume1Id,
      reply: 'Replied',
      status: 'In Progress',
      notes: 'Technical screening with Engineering Manager scheduled.',
      salary: '₹11 - 14 LPA'
    },
    {
      s_no: 11,
      company: 'Thoughtworks',
      role: 'Graduate Developer (2026)',
      location: 'Chennai / Coimbatore',
      portal: 'Company Careers',
      date: '2026-08-14',
      resumeId: resume1Id,
      reply: 'Replied',
      status: 'Interview Scheduled',
      notes: 'Paired programming interview invitation received.',
      salary: '₹9 - 11 LPA'
    },
    {
      s_no: 12,
      company: 'Flipkart',
      role: 'UI Engineer (React / TypeScript)',
      location: 'Bengaluru',
      portal: 'LinkedIn',
      date: '2026-08-18',
      resumeId: resume2Id,
      reply: 'No Reply',
      status: 'Applied',
      notes: 'Tracked on Workday portal.',
      salary: '₹15 - 18 LPA'
    },
    {
      s_no: 13,
      company: 'Postman',
      role: 'Software Engineer - Developer Experience',
      location: 'Remote (India)',
      portal: 'Wellfound',
      date: '2026-08-22',
      resumeId: resume1Id,
      reply: 'No Reply',
      status: 'Applied',
      notes: 'Submitted customized cover letter highlighting open-source API contributions.',
      salary: '₹18 - 22 LPA'
    },
    {
      s_no: 14,
      company: 'Hasura',
      role: 'Junior Full Stack Engineer (GraphQL / React)',
      location: 'Remote',
      portal: 'Wellfound',
      date: '2026-08-28',
      resumeId: resume1Id,
      reply: 'Replied',
      status: 'In Progress',
      notes: 'Received initial email from recruiter; scheduled 20-min chat.',
      salary: '₹14 - 17 LPA'
    },
    {
      s_no: 15,
      company: 'BrowserStack',
      role: 'Software Development Engineer - Core Engine',
      location: 'Mumbai / Remote',
      portal: 'LinkedIn',
      date: '2026-09-02',
      resumeId: resume1Id,
      reply: 'No Reply',
      status: 'Applied',
      notes: 'Direct application on company portal.',
      salary: '₹16 - 20 LPA'
    },
    {
      s_no: 16,
      company: 'Cred',
      role: 'Full Stack SDE',
      location: 'Bengaluru',
      portal: 'Instahyre',
      date: '2026-09-05',
      resumeId: resume1Id,
      reply: 'No Reply',
      status: 'Applied',
      notes: 'Applied with portfolio and GitHub repo links.',
      salary: '₹20 - 25 LPA'
    },
    {
      s_no: 17,
      company: 'Zerodha',
      role: 'Front-end Developer (Kite UI)',
      location: 'Bengaluru',
      portal: 'Company Careers',
      date: '2026-09-08',
      resumeId: resume2Id,
      reply: 'No Reply',
      status: 'Applied',
      notes: 'Submitted link to GitHub profile and custom web performance projects.',
      salary: '₹12 - 16 LPA'
    }
  ];

  const appIds: { [key: number]: string } = {};

  for (const app of sampleApps) {
    const appId = uuidv4();
    appIds[app.s_no] = appId;

    execute(`
      INSERT INTO job_applications (
        id, user_id, s_no, company_name, role_applied, job_location, 
        job_portal, application_date, resume_used_id, reply_status, 
        application_status, notes, salary_range
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      appId, userId, app.s_no, app.company, app.role, app.location,
      app.portal, app.date, app.resumeId, app.reply,
      app.status, app.notes, app.salary
    ]);
  }

  // Sample Interviews
  // 1. Zoho walk-in interview
  const interviewZohoId = uuidv4();
  execute(`
    INSERT INTO interviews (
      id, job_application_id, interview_date, interview_type, 
      interview_status, is_walk_in, walk_in_details, round_name, notes
    )
    VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?)
  `, [
    interviewZohoId,
    appIds[2],
    '2026-09-16',
    'In-Person (Walk-in)',
    'Scheduled',
    'Zoho Block 7, DLF IT Park, Mount Poonamallee Rd, Manapakkam, Chennai. POC: HR Ramesh (044-67447000). Bring 2 copies of resume, college ID card and portfolio printout.',
    'Round 3: Advanced Data Structures & Machine Coding',
    'Prepare C++/Java and low-level object-oriented design.'
  ]);

  // 2. Shared Box Chess offer interview
  const interviewChessId = uuidv4();
  execute(`
    INSERT INTO interviews (
      id, job_application_id, interview_date, interview_type, 
      interview_status, is_walk_in, walk_in_details, round_name, notes
    )
    VALUES (?, ?, ?, ?, ?, 0, NULL, ?, ?)
  `, [
    interviewChessId,
    appIds[1],
    '2026-05-18',
    'Virtual (Google Meet)',
    'Offer',
    'Final Technical & Leadership Discussion',
    'Cleared successfully! Received internship offer as Software Developer Intern.'
  ]);

  // 3. Razorpay attended interview with rejection feedback
  const interviewRazorpayId = uuidv4();
  execute(`
    INSERT INTO interviews (
      id, job_application_id, interview_date, interview_type, 
      interview_status, is_walk_in, walk_in_details, round_name, notes
    )
    VALUES (?, ?, ?, ?, ?, 0, NULL, ?, ?)
  `, [
    interviewRazorpayId,
    appIds[6],
    '2026-07-22',
    'Virtual (Zoom)',
    'Rejected',
    'Round 2: Frontend Architecture & Performance',
    'Good feedback on component lifecycle and React hooks; asked for deeper knowledge in Web Workers and SSR hydration.'
  ]);

  // Rejection feedback for Razorpay
  execute(`
    INSERT INTO rejections_feedback (
      id, interview_id, rejection_reason, detailed_notes, improvement_suggestions
    )
    VALUES (?, ?, ?, ?, ?)
  `, [
    uuidv4(),
    interviewRazorpayId,
    'System Design Depth & Distributed Caching',
    'Interviewer wanted candidate to articulate Redis caching strategies, stale-while-revalidate patterns, and how Next.js SSR stream rendering works under high load.',
    'Build a real-time analytics dashboard with Redis pub/sub and Next.js server components to showcase mastery during upcoming interviews.'
  ]);

  // 4. Juspay upcoming interview
  const interviewJuspayId = uuidv4();
  execute(`
    INSERT INTO interviews (
      id, job_application_id, interview_date, interview_type, 
      interview_status, is_walk_in, walk_in_details, round_name, notes
    )
    VALUES (?, ?, ?, ?, ?, 0, NULL, ?, ?)
  `, [
    interviewJuspayId,
    appIds[7],
    '2026-09-18',
    'Virtual',
    'Scheduled',
    'Round 2: Algorithmic Problem Solving & System Architecture',
    'Focus on graph algorithms, state machines and API design.'
  ]);

  // Waitlist Jobs
  const waitlistItems = [
    {
      company: 'Stripe',
      role: 'Software Engineer - University Graduate 2026',
      url: 'https://stripe.com/jobs/university-grad',
      notes: 'Applications open in October 2026. Review Stripe CLI codebase and API design principles.',
      status: 'Wishlist',
      salary: '₹26 - 32 LPA'
    },
    {
      company: 'Uber',
      role: 'Associate Software Engineer (Backend / Distributed Systems)',
      url: 'https://uber.com/careers/university',
      notes: 'Requires strong understanding of Go/Java and microservices. Ping college alumni on LinkedIn.',
      status: 'Wishlist',
      salary: '₹22 - 28 LPA'
    },
    {
      company: 'Atlassian',
      role: 'Graduate Software Developer',
      url: 'https://atlassian.com/company/careers',
      notes: 'Strong culture of teamwork and values. Practice behavioral stories using STAR method.',
      status: 'Wishlist',
      salary: '₹19 - 24 LPA'
    },
    {
      company: 'Postman',
      role: 'Developer Relations Intern / Open Source SDE',
      url: 'https://postman.com/careers',
      notes: 'Already applied for full-time SDE; keep this as alternate target for open-source engineering.',
      status: 'Wishlist',
      salary: '₹15 - 18 LPA'
    }
  ];

  for (const item of waitlistItems) {
    execute(`
      INSERT INTO waitlist_jobs (id, user_id, company_name, role, job_url, notes, status, salary_expectation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      uuidv4(), userId, item.company, item.role, item.url, item.notes, item.status, item.salary
    ]);
  }

  console.log('Seed completed successfully for Kavi (user_id: ' + userId + ')');
  return userId;
}

if (process.argv[1] && process.argv[1].includes('seed.ts')) {
  seedDatabase();
}
