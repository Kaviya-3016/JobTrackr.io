import { useState, useEffect } from 'react';
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
import { HomePage } from './pages/HomePage';
import { ContributePage } from './pages/ContributePage';

import { AuthModal } from './components/auth/AuthModal';
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
  const [currentView, setCurrentView] = useState<'home' | 'app'>('home');
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

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

  // Initial load: verify session token
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const meRes = await api.getMe();
        if (meRes.user) {
          setUser(meRes.user);
          setCurrentView('app');
          await refreshAll();
          return;
        }
      }
      // No active session -> show landing home page
      setCurrentView('home');
    } catch (err) {
      console.warn('Session verification fallback to home page', err);
      localStorage.removeItem('token');
      setUser(null);
      setCurrentView('home');
    } finally {
      setIsInitializing(false);
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

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = async (authenticatedUser: User, message?: string) => {
    setUser(authenticatedUser);
    setCurrentView('app');
    await refreshAll();
    showToast(message || `Welcome, ${authenticatedUser.name}!`);
  };


  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setApplications([]);
    setResumes([]);
    setInterviews([]);
    setWaitlist([]);
    setAnalytics(null);
    setHeatmapDays([]);
    setCurrentView('home');
    showToast('Signed out successfully');
  };

  const handleGoHome = () => {
    setCurrentView('home');
  };

  const handleGoToDashboard = () => {
    if (user) {
      setCurrentView('app');
    } else {
      handleOpenAuth('signin');
    }
  };

  const activeResume = resumes.find(r => Boolean(r.is_active)) || resumes[0] || null;

  // Application Handlers
  const handleSaveApp = async (data: any) => {
    try {
      if (editingApp) {
        await api.updateApplication(editingApp.id, data);
        showToast('Application updated successfully');
      } else {
        await api.createApplication(data);
        showToast('Application added successfully');
      }
      setIsAppModalOpen(false);
      setEditingApp(null);
      await refreshAll();
    } catch (err: any) {
      showToast(err.message || 'Failed to save application', 'error');
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application record?')) return;
    try {
      await api.deleteApplication(id);
      showToast('Application deleted');
      await refreshAll();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete application', 'error');
    }
  };


  // Interview Handlers
  const handleSaveInterview = async (data: any) => {
    try {
      if (editingInterview) {
        await api.updateInterview(editingInterview.id, data);
        showToast('Interview round updated');
      } else {
        await api.createInterview(data);
        showToast('Interview round scheduled');
      }
      setIsInterviewModalOpen(false);
      setEditingInterview(null);
      await refreshAll();
    } catch (err: any) {
      showToast(err.message || 'Failed to save interview', 'error');
    }
  };

  const handleDeleteInterview = async (id: string) => {
    if (!window.confirm('Delete this interview round?')) return;
    try {
      await api.deleteInterview(id);
      showToast('Interview deleted');
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to delete interview', 'error');
    }
  };

  const handleSaveFeedback = async (interviewId: string, feedback: {
    rejection_reason: string;
    detailed_notes: string;
    improvement_suggestions?: string;
  }) => {
    try {
      await api.addInterviewFeedback(interviewId, feedback);
      showToast('Feedback & AI tips recorded');
      setIsFeedbackModalOpen(false);
      setFeedbackInterview(null);
      await refreshAll();
    } catch {
      showToast('Failed to record feedback', 'error');
    }
  };

  // Waitlist Handlers
  const handleSaveWaitlist = async (data: any) => {
    try {
      if (editingWaitlist) {
        await api.updateWaitlist(editingWaitlist.id, data);
        showToast('Bookmark updated');
      } else {
        await api.createWaitlist(data);
        showToast('Opportunity saved to waitlist');
      }
      setIsWaitlistModalOpen(false);
      setEditingWaitlist(null);
      await refreshAll();
    } catch (err: any) {
      showToast(err.message || 'Failed to save waitlist entry', 'error');
    }
  };

  const handleDeleteWaitlist = async (id: string) => {
    if (!window.confirm('Remove from waitlist?')) return;
    try {
      await api.deleteWaitlist(id);
      showToast('Waitlist opportunity deleted');
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to delete waitlist entry', 'error');
    }
  };

  const handleConvertWaitlist = async (id: string) => {
    try {
      await api.convertWaitlistToApp(id);
      showToast('Converted to Active Application!');
      await refreshAll();
      setCurrentTab('applications');
    } catch (err: any) {
      showToast(err.message || 'Failed to convert to application', 'error');
    }
  };

  // Resume Handlers
  const handleSetActiveResume = async (id: string) => {
    try {
      await api.setActiveResume(id);
      showToast('Primary active resume updated');
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to set active resume', 'error');
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.deleteResume(id);
      showToast('Resume deleted');
      await refreshAll();
    } catch (err: any) {
      showToast('Failed to delete resume', 'error');
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#0a0414] flex items-center justify-center text-pink-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider uppercase text-pink-300">Loading JobTrackr.io...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0612] text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border animate-bounce ${
            toast.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-gradient-to-r from-purple-900/90 to-pink-900/90 border-pink-500/40 text-pink-100 shadow-pink-950/50'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-pink-400" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      {/* View Switcher: Landing Home Page vs Dashboard App */}
      {currentView === 'home' ? (
        <HomePage
          user={user}
          onOpenAuth={handleOpenAuth}
          onGoToDashboard={handleGoToDashboard}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <>
          {/* Main App Navbar */}
          <Navbar
            user={user}
            activeResume={activeResume}
            onNewApplication={() => {
              setEditingApp(null);
              setIsAppModalOpen(true);
            }}
            theme={theme}
            onToggleTheme={toggleTheme}
            onGoHome={handleGoHome}
            onOpenAuth={handleOpenAuth}
            onLogout={handleLogout}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              appCount={applications.length}
              offerCount={applications.filter(a => a.application_status === 'Offer').length}
              interviewCount={interviews.length}
            />

            {/* Main Tab Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0a0612]/60 transition-colors duration-200">
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
                  onLogInterviewForApp={(_app) => {
                    setEditingInterview(null);
                    setIsInterviewModalOpen(true);
                  }}
                  onStatusChange={async (id, status) => {
                    await api.updateApplication(id, { application_status: status });
                    await refreshAll();
                  }}
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

              {currentTab === 'contribute' && (
                <ContributePage user={user} />
              )}
            </main>
          </div>
        </>
      )}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

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
