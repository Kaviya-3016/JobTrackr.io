import React from 'react';
import {
  Briefcase,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Github,
  CheckCircle2,
  BarChart3,
  Calendar,
  FileText,
  Building2,
  Download,
  Flame,
  ShieldCheck,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import type { User } from '../types';

interface HomePageProps {
  user: User | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onGoToDashboard: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  user,
  onOpenAuth,
  onGoToDashboard,
  theme,
  onToggleTheme
}) => {
  return (
    <div className="min-h-screen bg-[#0a0414] text-slate-100 selection:bg-pink-500 selection:text-white overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-pink-600/20 via-purple-600/20 to-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-900/15 rounded-full blur-[150px]" />
      </div>

      {/* Navigation Header */}
      <header className="relative z-20 sticky top-0 bg-[#0d051c]/80 backdrop-blur-md border-b border-pink-500/20 px-6 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-pink-600/30 text-white font-bold ring-2 ring-pink-500/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">
                JobTrackr.io
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-white/5 border border-pink-500/20 text-pink-200 hover:text-white hover:bg-white/10 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-pink-400" />}
            </button>

            {user ? (
              <button
                onClick={onGoToDashboard}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-bold shadow-lg shadow-pink-600/30 hover:opacity-95 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-pink-200 hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-bold shadow-lg shadow-pink-600/30 hover:opacity-95 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Open Source Pill Badge */}
        <a
          href="https://github.com/Kaviya-3016/JobTrackr.io"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-6 backdrop-blur-md transition-all hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#f09433]" />
          <span>100% Free & Open Source on GitHub • MIT License</span>
          <ChevronRight className="w-3 h-3 text-pink-400" />
        </a>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          Track Every Application. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">
            Crack Every Interview.
          </span> <br className="hidden sm:inline" />
          Land Your Dream Role.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-pink-100/70 max-w-3xl mx-auto leading-relaxed mb-10">
          The ultimate career intelligence cockpit for software engineers and ambitious job hunters. Built with a <span className="text-pink-200 font-semibold">365-Day GitHub-style contribution heatmap</span>, <span className="text-pink-200 font-semibold">in-person walk-in logs</span>, multi-portal response analytics, and multi-version resume management.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onOpenAuth('signup')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-pink-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenAuth('signin')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 border border-pink-500/30 text-pink-200 hover:text-white font-bold text-sm shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Sign In to Account</span>
          </button>

          <a
            href="https://github.com/Kaviya-3016/JobTrackr.io"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-pink-500/20 text-white font-semibold text-sm transition-all hover:scale-105"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
        </div>

        {/* Interactive Dashboard Preview Card */}
        <div className="relative mx-auto max-w-5xl rounded-3xl p-1 bg-gradient-to-b from-pink-500/40 via-purple-500/20 to-transparent shadow-2xl shadow-purple-950/80">
          <div className="rounded-[22px] bg-[#120824] border border-pink-500/20 p-6 sm:p-8 text-left overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center justify-between pb-6 border-b border-pink-500/20 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs font-mono text-pink-200/50">jobtrackr.io/dashboard</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-[11px] font-bold text-pink-300">
                <Flame className="w-3.5 h-3.5 text-[#f09433]" />
                <span>24-Day Active Streak</span>
              </div>
            </div>

            {/* Top KPI Cards Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20">
                <span className="text-[11px] text-pink-200/60 uppercase font-bold tracking-wider">Applications</span>
                <p className="text-2xl font-black text-white mt-1">48</p>
                <span className="text-[10px] text-emerald-400 font-semibold">↑ 12 this week</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20">
                <span className="text-[11px] text-pink-200/60 uppercase font-bold tracking-wider">Reply Rate</span>
                <p className="text-2xl font-black text-[#f09433] mt-1">18.7%</p>
                <span className="text-[10px] text-pink-200/60 font-semibold">9 replies received</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20">
                <span className="text-[11px] text-pink-200/60 uppercase font-bold tracking-wider">Interviews</span>
                <p className="text-2xl font-black text-[#dc2743] mt-1">6</p>
                <span className="text-[10px] text-pink-200/60 font-semibold">2 In-Person Walk-ins</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20">
                <span className="text-[11px] text-pink-200/60 uppercase font-bold tracking-wider">Job Portals</span>
                <p className="text-2xl font-black text-emerald-400 mt-1">6 Tracked</p>
                <span className="text-[10px] text-emerald-400 font-semibold">LinkedIn, Naukri & More</span>
              </div>
            </div>

            {/* Heatmap Visual Teaser */}
            <div className="p-4 rounded-2xl bg-white/5 border border-pink-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-pink-200">365-Day Job Hunt Activity</span>
                <div className="flex items-center gap-1.5 text-[10px] text-pink-200/60">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-pink-950" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-pink-700" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-[#dc2743]" />
                  <div className="w-2.5 h-2.5 rounded-[2px] bg-[#f09433]" />
                  <span>More</span>
                </div>
              </div>
              {/* Simulated mini heat grid */}
              <div className="grid grid-flow-col grid-rows-4 gap-1 overflow-x-auto py-1">
                {Array.from({ length: 44 }).map((_, col) => (
                  <React.Fragment key={col}>
                    {Array.from({ length: 4 }).map((_, row) => {
                      const active = (col * 3 + row) % 5 !== 0;
                      const intensity = (col + row) % 4;
                      const bg = !active
                        ? 'bg-white/5'
                        : intensity === 3
                        ? 'bg-[#f09433]'
                        : intensity === 2
                        ? 'bg-[#dc2743]'
                        : intensity === 1
                        ? 'bg-pink-700'
                        : 'bg-purple-800';
                      return (
                        <div
                          key={`${col}-${row}`}
                          className={`w-3.5 h-3.5 rounded-[3px] ${bg} transition-transform hover:scale-125`}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-pink-500/20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f09433]">Built for High Performance</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4">
            Everything You Need to Win the Hiring Game
          </h2>
          <p className="text-sm sm:text-base text-pink-200/70">
            No spreadsheets, no messy bookmarks, no lost follow-ups. JobTrackr.io gives you an unfair advantage in today's competitive tech job market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-7 rounded-3xl bg-[#130826] border border-pink-500/20 hover:border-pink-500/40 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] to-[#dc2743] flex items-center justify-center text-white mb-5 shadow-md shadow-pink-600/30">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">365-Day Contribution Heatmap</h3>
            <p className="text-xs text-pink-200/70 leading-relaxed">
              Visualize your daily application consistency just like GitHub commits. Track active streaks, max streaks, and daily submission velocity over the entire year.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-3xl bg-[#130826] border border-pink-500/20 hover:border-pink-500/40 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#dc2743] to-[#bc1888] flex items-center justify-center text-white mb-5 shadow-md shadow-purple-600/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interview Retrospectives & STAR Feedback</h3>
            <p className="text-xs text-pink-200/70 leading-relaxed">
              Log interview rounds, technical evaluation notes, and constructive feedback following the STAR methodology to turn rejections into stepping stones for dream offers.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-3xl bg-[#130826] border border-pink-500/20 hover:border-pink-500/40 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#bc1888] to-purple-600 flex items-center justify-center text-white mb-5 shadow-md shadow-pink-600/30">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Interview & Walk-in Logger</h3>
            <p className="text-xs text-pink-200/70 leading-relaxed">
              Track multi-stage virtual rounds or in-person walk-in drives with exact venue addresses, HR contacts, reporting times, and required document checklists.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-7 rounded-3xl bg-[#130826] border border-pink-500/20 hover:border-pink-500/40 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#f09433] flex items-center justify-center text-white mb-5 shadow-md shadow-amber-600/30">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Response Rate & Portal Analytics</h3>
            <p className="text-xs text-pink-200/70 leading-relaxed">
              Discover which portals give you responses (LinkedIn, Naukri, Wellfound, Direct) and which are black holes. Make data-driven decisions on where to apply.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-7 rounded-3xl bg-[#130826] border border-pink-500/20 hover:border-pink-500/40 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-600 flex items-center justify-center text-white mb-5 shadow-md shadow-rose-600/30">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Multi-CV Resume Hub</h3>
            <p className="text-xs text-pink-200/70 leading-relaxed">
              Store multiple tailored resumes (SDE, Frontend, Systems) and link specific resumes to applications so you always know which version landed you the interview.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-7 rounded-3xl bg-[#130826] border border-pink-500/20 hover:border-pink-500/40 transition-all hover:-translate-y-1 shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mb-5 shadow-md shadow-indigo-600/30">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant PDF & CSV Export</h3>
            <p className="text-xs text-pink-200/70 leading-relaxed">
              Generate beautifully formatted executive PDF reports or raw CSV spreadsheets for your mentors, college placement cells, or personal offline records.
            </p>
          </div>
        </div>
      </section>

      {/* Why Open Source Section */}
      <section id="opensource" className="relative z-10 py-20 px-6 max-w-7xl mx-auto border-t border-pink-500/20">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-purple-950/40 via-[#130826] to-pink-950/30 border border-pink-500/30 shadow-2xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free, Transparent & Community-Driven</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Why Open Source Matters for Job Seekers
            </h2>
            <p className="text-sm sm:text-base text-pink-100/70 leading-relaxed mb-6">
              Your job search data contains sensitive career history, salaries, rejection notes, and personal contacts. With JobTrackr.io, your data belongs to you:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-pink-200/80">Self-host locally with embedded SQLite — zero cloud setup required.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-pink-200/80">Dual engine: easily connect Supabase PostgreSQL for cloud sync.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-pink-200/80">MIT Licensed: Free to modify, extend, and deploy anywhere.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-pink-200/80">No subscription fees, no paywalled limits, no ad tracking.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://github.com/Kaviya-3016/JobTrackr.io"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-pink-100 transition-all hover:scale-105"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://github.com/Kaviya-3016/JobTrackr.io/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-pink-500/20 text-white font-bold text-xs transition-all"
              >
                Contribute / Submit PR
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
          Ready to Take Command of Your Career?
        </h2>
        <p className="text-sm sm:text-base text-pink-200/70 max-w-2xl mx-auto mb-8">
          Join developers building consistent application streaks and landing higher-paying offers with full career tracking transparency.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuth('signup')}
            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-extrabold text-sm shadow-xl shadow-pink-600/40 hover:opacity-95 transition-all hover:scale-105 cursor-pointer"
          >
            Create Your Free Account
          </button>
          <button
            onClick={() => onOpenAuth('signin')}
            className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-pink-500/30 text-white font-bold text-sm transition-all hover:scale-105 cursor-pointer"
          >
            Sign In to Dashboard
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-pink-500/20 py-10 px-6 text-center text-xs text-pink-200/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-pink-100">JobTrackr.io</span>
            <span>• Open Source MIT License</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Kaviya-3016/JobTrackr.io" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://github.com/Kaviya-3016/JobTrackr.io/blob/main/LICENSE" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              License
            </a>
            <a href="https://github.com/Kaviya-3016/JobTrackr.io/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Contributing
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
