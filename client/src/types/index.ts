export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  portfolio?: string;
  bio?: string;
  createdAt?: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  s_no: number;
  company_name: string;
  role_applied: string;
  job_location: string;
  job_portal: string;
  application_date: string;
  resume_used_id?: string;
  resume_name?: string;
  reply_status: string;
  application_status: string;
  notes?: string;
  salary_range?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Resume {
  id: string;
  user_id: string;
  resume_name: string;
  file_url: string;
  ats_score?: number;
  is_active: number | boolean;
  uploaded_date: string;
}

export interface Interview {
  id: string;
  job_application_id: string;
  company_name?: string;
  role_applied?: string;
  job_location?: string;
  location?: string;
  interview_date: string;
  interview_type: string;
  interview_status: string;
  is_walk_in: number | boolean;
  walk_in_details?: string;
  round_name?: string;
  notes?: string;
  resume_used_id?: string;
  resume_name?: string;
  resume_file_url?: string;
  created_at?: string;
  feedback_id?: string;
  rejection_reason?: string;
  feedback_notes?: string;
  improvement_suggestions?: string;
}

export interface RejectionFeedback {
  id: string;
  interview_id: string;
  rejection_reason: string;
  detailed_notes: string;
  improvement_suggestions?: string;
  created_at?: string;
}

export interface WaitlistLink {
  title: string;
  url: string;
}

export interface WaitlistJob {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  job_url?: string;
  description?: string;
  screenshot_url?: string;
  links?: string | WaitlistLink[];
  notes?: string;
  status: 'Wishlist' | 'Applied' | 'Completed';
  salary_expectation?: string;
  added_date: string;
}

export interface AnalyticsOverview {
  totalApplications: number;
  repliedApplications: number;
  replyAccuracy: number;
  scheduledInterviews: number;
  totalInterviews: number;
  offers: number;
  inProgress: number;
  rejected: number;
  interviewSuccessRate: number;
  statusBreakdown: { status: string; count: number }[];
  portalBreakdown: { portal: string; count: number }[];
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface WeeklySummary {
  week: string;
  total: number;
  replies: number;
  replyAccuracy: number;
}

export interface MonthlySummary {
  month: string;
  total: number;
  replies: number;
  offers: number;
  replyAccuracy: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: number;
}

export interface ATSAnalysisResult {
  score: number;
  matchGrade: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvementAreas: string[];
  formattingScore: number;
  detailedFeedback: string;
}

export interface ResumeFeedbackResult {
  summary: string;
  bulletPointCritique: {
    originalExample: string;
    suggestedRewrite: string;
    reason: string;
  }[];
  skillsToHighlight: string[];
  actionVerbRecommendations: string[];
  industryAlignment: string;
}

export interface RoleRecommendation {
  roleTitle: string;
  matchProbability: number;
  expectedSalaryRange: string;
  keySkillsRequired: string[];
  reason: string;
  sampleCompanies: string[];
}
