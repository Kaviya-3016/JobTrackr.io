import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import type { NavTab } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ResumesPage } from './pages/ResumesPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { WaitlistPage } from './pages/WaitlistPage';
import { ExportPage } from './pages/ExportPage';

import { ApplicationModal } from './components/applications/ApplicationModal';
import { InterviewModal } from './components/interviews/InterviewModal';
import { RejectionFeedbackModal } from './components/interviews/RejectionFeedbackModal';
import { WaitlistModal } from './components/waitlist/WaitlistModal';
import { ResumeViewerModal } from './components/resumes/ResumeViewerModal';

import type {
  User,
  JobApplication,
  Resume,
  Interview,
  WaitlistJob,
  AnalyticsOverview,
  HeatmapDay
} from './types';
import { api } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('jobtrackr_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('jobtrackr_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistJob[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [heatmapDays, setHeatmapDays] = useState<HeatmapDay[]>([]);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  // Modals state
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [interviewModalType, setInterviewModalType] = useState<'interview' | 'walk-in'>('interview');

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackInterview, setFeedbackInterview] = useState<Interview | null>(null);

  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [editingWaitlist, setEditingWaitlist] = useState<WaitlistJob | null>(null);

  const [viewingResume, setViewingResume] = useState<Resume | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Auto-login / verify session as Kavi
      const authRes = await api.login('kaviyamurugan3016@gmail.com', 'password123');
      if (authRes.token) {
        localStorage.setItem('token', authRes.token);
        setUser(authRes.user);
      }

      await refreshAll();
    } catch (err) {
      console.error('Failed to initialize app', err);
    }
  };

  const refreshAll = async () => {
    try {
      const [appRes, resRes, ivRes, wlRes, anRes, hmRes] = await Promise.all([
        api.getApplications({ sort: 'desc' }),
        api.getResumes(),
        api.getInterviews(),
        api.getWaitlist(),
        api.getAnalyticsOverview(),
        api.getHeatmapData()
      ]);

      setApplications(appRes.applications || []);
      setResumes(resRes.resumes || []);
      setInterviews(ivRes.interviews || []);
      setWaitlist(wlRes.waitlist || []);
      setAnalytics(anRes);
      setHeatmapDays(hmRes.days || []);
    } catch (err) {
      console.error('Failed to refresh data', err);
    }
  };

  const activeResume = resumes.find(r => Boolean(r.is_active)) || resumes[0] || null;

  // Application Handlers
  const handleSaveApp = async (data: Partial<JobApplication>) => {
    if (editingApp) {
      const res = await api.updateApplication(editingApp.id, data);
      showToast(`Updated Application #${editingApp.s_no} (${res.application.company_name})`);
    } else {
      const res = await api.createApplication(data);
      showToast(`Application #${res.application.s_no} for ${res.application.company_name} created!`);
    }
    setEditingApp(null);
    await refreshAll();
  };

  const handleDeleteApp = async (id: string) => {
    await api.deleteApplication(id);
    showToast('Application deleted successfully');
    await refreshAll();
  };

  const handleStatusChange = async (id: string, status: JobApplication['application_status']) => {
    await api.updateApplication(id, { application_status: status });
    showToast(`Status updated to ${status}`);
    await refreshAll();
  };

  // Interview Handlers
  const handleSaveInterview = async (data: Partial<Interview> & { company_name?: string; role_applied?: string; location?: string }) => {
    if (editingInterview && editingInterview.id) {
      await api.updateInterview(editingInterview.id, data);
      showToast('Interview updated successfully');
    } else {
      await api.createInterview(data);
      showToast(data.is_walk_in ? 'Walk-in drive logged!' : 'Interview scheduled & tracked!');
    }
    setEditingInterview(null);
    await refreshAll();
  };

  const handleDeleteInterview = async (id: string) => {
    await api.deleteInterview(id);
    showToast('Interview deleted');
    await refreshAll();
  };

  const handleSaveFeedback = async (
    interviewId: string,
    feedback: { rejection_reason: string; detailed_notes: string; improvement_suggestions?: string }
  ) => {
    await api.addInterviewFeedback(interviewId, feedback);
    showToast('Constructive rejection feedback recorded');
    await refreshAll();
  };

  // Waitlist Handlers
  const handleSaveWaitlist = async (data: Partial<WaitlistJob>) => {
    if (editingWaitlist) {
      await api.updateWaitlistJob(editingWaitlist.id, data);
      showToast('Wishlist item updated');
    } else {
      await api.createWaitlistJob(data);
      showToast('Added to Wishlist queue');
    }
    setEditingWaitlist(null);
    await refreshAll();
  };

  const handleDeleteWaitlist = async (id: string) => {
    await api.deleteWaitlistJob(id);
    showToast('Removed from wishlist');
    await refreshAll();
  };

  const handleConvertWaitlist = async (id: string) => {
    const res = await api.convertWaitlistToApp(id);
    showToast(res.message);
    await refreshAll();
    setCurrentTab('applications');
  };

  // Resume Handlers
  const handleSetActiveResume = async (id: string) => {
    await api.setActiveResume(id);
    showToast('Active resume designated');
    await refreshAll();
  };

  const handleDeleteResume = async (id: string) => {
    await api.deleteResume(id);
    showToast('Resume removed');
    await refreshAll();
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col selection:bg-pink-500/30 selection:text-pink-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-slide-up">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-medium backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : 'bg-[#1e0f33]/95 border-pink-500/40 text-pink-200 shadow-pink-500/20'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-pink-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        activeResume={activeResume}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNewApplication={() => {
          setEditingApp(null);
          setIsAppModalOpen(true);
        }}
        onViewResume={(r) => setViewingResume(r)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          appCount={applications.length}
          offerCount={analytics?.offers || 0}
          interviewCount={interviews.length}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-61px)]">
          {currentTab === 'dashboard' && (
            <DashboardPage
              analytics={analytics}
              applications={applications}
              interviews={interviews}
              onNavigateTab={setCurrentTab}
              onOpenNewApp={() => {
                setEditingApp(null);
                setIsAppModalOpen(true);
              }}
              onEditApp={(app) => {
                setEditingApp(app);
                setIsAppModalOpen(true);
              }}
            />
          )}

          {currentTab === 'applications' && (
            <ApplicationsPage
              applications={applications}
              resumes={resumes}
              onOpenNewApp={() => {
                setEditingApp(null);
                setIsAppModalOpen(true);
              }}
              onEditApp={(app) => {
                setEditingApp(app);
                setIsAppModalOpen(true);
              }}
              onDeleteApp={handleDeleteApp}
              onLogInterviewForApp={(app) => {
                setEditingInterview({
                  id: '',
                  job_application_id: app.id,
                  company_name: app.company_name,
                  role_applied: app.role_applied,
                  job_location: app.job_location,
                  location: app.job_location,
                  interview_date: new Date().toISOString().split('T')[0],
                  interview_type: 'Virtual (Google Meet)',
                  interview_status: 'Scheduled',
                  is_walk_in: 0,
                  resume_used_id: app.resume_used_id
                } as Interview);
                setInterviewModalType('interview');
                setIsInterviewModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
              onViewResume={(r) => setViewingResume(r)}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsPage
              overview={analytics}
              heatmapDays={heatmapDays}
            />
          )}

          {currentTab === 'resumes' && (
            <ResumesPage
              resumes={resumes}
              onUploadSuccess={refreshAll}
              onSetActive={handleSetActiveResume}
              onDeleteResume={handleDeleteResume}
              onViewResume={(r) => setViewingResume(r)}
            />
          )}

          {currentTab === 'interviews' && (
            <InterviewsPage
              interviews={interviews}
              applications={applications}
              resumes={resumes}
              onOpenNewInterview={(mode) => {
                setEditingInterview(null);
                setInterviewModalType(mode || 'interview');
                setIsInterviewModalOpen(true);
              }}
              onEditInterview={(iv) => {
                setEditingInterview(iv);
                setInterviewModalType(iv.is_walk_in ? 'walk-in' : 'interview');
                setIsInterviewModalOpen(true);
              }}
              onDeleteInterview={handleDeleteInterview}
              onOpenFeedback={(iv) => {
                setFeedbackInterview(iv);
                setIsFeedbackModalOpen(true);
              }}
              onViewResume={(r) => setViewingResume(r)}
            />
          )}

          {currentTab === 'waitlist' && (
            <WaitlistPage
              waitlist={waitlist}
              onOpenNewWaitlist={() => {
                setEditingWaitlist(null);
                setIsWaitlistModalOpen(true);
              }}
              onEditWaitlist={(item) => {
                setEditingWaitlist(item);
                setIsWaitlistModalOpen(true);
              }}
              onDeleteWaitlist={handleDeleteWaitlist}
              onConvertToApp={handleConvertWaitlist}
            />
          )}

          {currentTab === 'export' && (
            <ExportPage user={user} applications={applications} />
          )}
        </main>
      </div>

      {/* Modals */}
      <ApplicationModal
        isOpen={isAppModalOpen}
        onClose={() => {
          setIsAppModalOpen(false);
          setEditingApp(null);
        }}
        onSubmit={handleSaveApp}
        editingApp={editingApp}
        resumes={resumes}
        onViewResume={(r) => setViewingResume(r)}
        onRefreshResumes={refreshAll}
      />

      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => {
          setIsInterviewModalOpen(false);
          setEditingInterview(null);
        }}
        onSubmit={handleSaveInterview}
        applications={applications}
        resumes={resumes}
        editingInterview={editingInterview}
        initialType={interviewModalType}
        onViewResume={(r) => setViewingResume(r)}
        onRefreshResumes={refreshAll}
      />

      <RejectionFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setFeedbackInterview(null);
        }}
        interview={feedbackInterview}
        onSubmit={handleSaveFeedback}
      />

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => {
          setIsWaitlistModalOpen(false);
          setEditingWaitlist(null);
        }}
        onSubmit={handleSaveWaitlist}
        editingItem={editingWaitlist}
      />

      <ResumeViewerModal
        isOpen={Boolean(viewingResume)}
        onClose={() => setViewingResume(null)}
        resume={viewingResume}
      />
    </div>
  );
}

export default App;
