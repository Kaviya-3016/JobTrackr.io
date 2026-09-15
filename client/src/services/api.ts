import type {
  User,
  JobApplication,
  Resume,
  Interview,
  WaitlistJob,
  AnalyticsOverview,
  DailyCount,
  WeeklySummary,
  MonthlySummary,
  HeatmapDay,
  ATSAnalysisResult,
  ResumeFeedbackResult,
  RoleRecommendation
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMsg = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch {
      // no JSON body
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email?: string, password?: string): Promise<{ token: string; user: User }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async getMe(): Promise<{ user: User }> {
    return request('/auth/me');
  },

  // Applications
  async getApplications(params?: {
    status?: string;
    portal?: string;
    reply?: string;
    search?: string;
    fromDate?: string;
    toDate?: string;
    sort?: 'asc' | 'desc';
  }): Promise<{ count: number; applications: JobApplication[] }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, v);
      });
    }
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return request(`/applications${qStr}`);
  },

  async createApplication(data: Partial<JobApplication>): Promise<{ message: string; application: JobApplication }> {
    return request('/applications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateApplication(id: string, data: Partial<JobApplication>): Promise<{ message: string; application: JobApplication }> {
    return request(`/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteApplication(id: string): Promise<{ message: string }> {
    return request(`/applications/${id}`, {
      method: 'DELETE'
    });
  },

  // Analytics
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    return request('/analytics/overview');
  },

  async getDailyCounts(days: number = 45): Promise<{ dailyCounts: DailyCount[] }> {
    return request(`/analytics/daily-count?days=${days}`);
  },

  async getWeeklySummary(): Promise<{ weeklySummary: WeeklySummary[] }> {
    return request('/analytics/weekly-summary');
  },

  async getMonthlySummary(): Promise<{ monthlySummary: MonthlySummary[] }> {
    return request('/analytics/monthly-summary');
  },

  async getReplyAccuracy(): Promise<any> {
    return request('/analytics/reply-accuracy');
  },

  async getInterviewStats(): Promise<any> {
    return request('/analytics/interview-stats');
  },

  async getHeatmapData(): Promise<{ totalDays: number; days: HeatmapDay[] }> {
    return request('/analytics/heatmap-data');
  },

  // Resumes
  async getResumes(): Promise<{ resumes: Resume[] }> {
    return request('/resumes');
  },

  async uploadResume(formData: FormData): Promise<{ message: string; resume: Resume; atsAnalysis?: ATSAnalysisResult }> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to upload resume');
    }
    return response.json();
  },

  async setActiveResume(id: string): Promise<{ message: string; resume: Resume }> {
    return request(`/resumes/${id}/active`, {
      method: 'PATCH'
    });
  },

  async getResumeATS(id: string): Promise<{ resume: Resume; analysis: ATSAnalysisResult }> {
    return request(`/resumes/${id}/ats-score`);
  },

  async deleteResume(id: string): Promise<{ message: string }> {
    return request(`/resumes/${id}`, {
      method: 'DELETE'
    });
  },

  // AI Services
  async analyzeATS(resumeText?: string, jobDescription?: string): Promise<ATSAnalysisResult> {
    return request('/ai/ats-analysis', {
      method: 'POST',
      body: JSON.stringify({ resumeText, jobDescription })
    });
  },

  async getResumeFeedback(resumeText?: string): Promise<ResumeFeedbackResult> {
    return request('/ai/resume-feedback', {
      method: 'POST',
      body: JSON.stringify({ resumeText })
    });
  },

  async getRoleRecommendations(): Promise<{ recommendations: RoleRecommendation[] }> {
    return request('/ai/role-recommendations', {
      method: 'POST'
    });
  },

  async getRejectionAnalysis(): Promise<{
    commonPatterns: string[];
    actionPlan: string[];
    recommendedResources: string[];
  }> {
    return request('/ai/rejection-analysis', {
      method: 'POST'
    });
  },

  // Interviews
  async getInterviews(): Promise<{ interviews: Interview[] }> {
    return request('/interviews');
  },

  async createInterview(data: Partial<Interview>): Promise<{ message: string; interview: Interview }> {
    return request('/interviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateInterview(id: string, data: Partial<Interview>): Promise<{ message: string; interview: Interview }> {
    return request(`/interviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async deleteInterview(id: string): Promise<{ message: string }> {
    return request(`/interviews/${id}`, {
      method: 'DELETE'
    });
  },

  async addInterviewFeedback(id: string, feedback: {
    rejection_reason: string;
    detailed_notes: string;
    improvement_suggestions?: string;
  }): Promise<{ message: string }> {
    return request(`/interviews/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedback)
    });
  },

  // Waitlist
  async getWaitlist(): Promise<{ waitlist: WaitlistJob[] }> {
    return request('/waitlist');
  },

  async createWaitlistJob(data: Partial<WaitlistJob>): Promise<{ message: string; item: WaitlistJob }> {
    return request('/waitlist', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateWaitlistJob(id: string, data: Partial<WaitlistJob>): Promise<{ message: string; item: WaitlistJob }> {
    return request(`/waitlist/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  async convertWaitlistToApp(id: string, details?: { job_location?: string; job_portal?: string }): Promise<{ message: string; application: JobApplication }> {
    return request(`/waitlist/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(details || {})
    });
  },

  async deleteWaitlistJob(id: string): Promise<{ message: string }> {
    return request(`/waitlist/${id}`, {
      method: 'DELETE'
    });
  },

  async uploadWaitlistScreenshot(file: File): Promise<{ message: string; file_url: string }> {
    const formData = new FormData();
    formData.append('screenshot', file);
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/waitlist/upload-screenshot', {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Failed to upload screenshot');
    }
    return res.json();
  },

  // Export
  async getPDFReportData(params?: { fromDate?: string; toDate?: string }): Promise<any> {
    const q = new URLSearchParams(params as any).toString();
    return request(`/export/pdf-data${q ? `?${q}` : ''}`);
  }
};
