import React, { useState } from 'react';
import {
  Github,
  GitPullRequest,
  GitBranch,
  Terminal,
  Code2,
  Heart,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  User as UserIcon,
  Mail,
  Phone,
  Sparkles,
  ShieldCheck,
  BookOpen,
  FileCode
} from 'lucide-react';
import type { User } from '../types';

interface ContributePageProps {
  user: User | null;
}

export const ContributePage: React.FC<ContributePageProps> = ({ user }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const contributionIdeas = [
    {
      title: 'Google Calendar / iCal Sync',
      tag: 'Feature',
      description: 'Add automated calendar export or live sync for virtual and in-person walk-in interview dates.'
    },
    {
      title: 'Job Portal Direct Parsers',
      tag: 'Integration',
      description: 'Enhance one-click application autofill from portals like LinkedIn, Wellfound, Instahyre, and YC WorkAtAStartup.'
    },
    {
      title: 'Custom PDF Export Themes',
      tag: 'UI/UX',
      description: 'Design additional minimalist and executive resume/application summary export templates.'
    },
    {
      title: 'Interview Preparation Checklist',
      tag: 'Enhancement',
      description: 'Pre-interview document checklist reminder (degree certificates, resume hardcopies, photo IDs).'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-tr from-purple-950/60 via-[#160b29] to-pink-950/40 border border-pink-500/30 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold mb-3">
              <Heart className="w-3.5 h-3.5 text-[#e1306c] fill-[#e1306c]" />
              <span>100% Free & Open Source Community Project</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Contribute to JobTrackr.io
            </h1>
            <p className="text-xs sm:text-sm text-pink-100/70 max-w-2xl mt-2 leading-relaxed">
              JobTrackr.io is built by developers, for developers. Whether you want to fix a bug, suggest a new feature, improve documentation, or showcase open-source contributions on your resume, your PR is warmly welcomed!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://github.com/Kaviya-3016/JobTrackr.io"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs shadow-lg hover:bg-pink-100 transition-all hover:scale-105"
            >
              <Github className="w-4 h-4" />
              <span>Star on GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://github.com/Kaviya-3016/JobTrackr.io/pulls"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-extrabold text-xs shadow-lg shadow-pink-600/30 hover:opacity-95 transition-all hover:scale-105"
            >
              <GitPullRequest className="w-4 h-4" />
              <span>Submit a PR</span>
            </a>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      {user && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#130826]/90 border border-pink-500/25 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-pink-500/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-xl font-black shadow-lg shadow-pink-600/30 ring-2 ring-pink-500/30">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{user.name || 'Developer'}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                    Active Profile
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  JobTrackr Member • Career Pilot
                </p>
              </div>
            </div>

            <a
              href="https://github.com/Kaviya-3016/JobTrackr.io/fork"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-pink-500/30 text-pink-200 hover:text-white text-xs font-semibold transition-all hover:scale-105"
            >
              <GitBranch className="w-3.5 h-3.5 text-pink-400" />
              <span>Fork Repo to Your Account</span>
              <ExternalLink className="w-3 h-3 text-pink-400" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/20">
              <div className="flex items-center gap-2 text-pink-300/60 text-xs mb-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Account Email</span>
              </div>
              <p className="text-xs font-semibold text-white truncate">{user.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/20">
              <div className="flex items-center gap-2 text-pink-300/60 text-xs mb-1">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub / Portfolio</span>
              </div>
              {user.portfolio ? (
                <a
                  href={user.portfolio.startsWith('http') ? user.portfolio : `https://${user.portfolio}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-pink-400 hover:underline flex items-center gap-1 truncate"
                >
                  <span>{user.portfolio}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>
              ) : (
                <span className="text-xs text-slate-500">Not linked</span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-purple-500/20">
              <div className="flex items-center gap-2 text-pink-300/60 text-xs mb-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Phone</span>
              </div>
              <p className="text-xs font-semibold text-white">{user.phone || '+91 7418082136'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Contribution Guide */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-md shadow-pink-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">How to Contribute (Quick Setup)</h2>
              <p className="text-xs text-slate-400">Step-by-step instructions from CONTRIBUTING.md</p>
            </div>
          </div>

          <a
            href="https://github.com/Kaviya-3016/JobTrackr.io/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
          >
            <span>Full CONTRIBUTING.md</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold flex items-center justify-center border border-pink-500/30">
                  1
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Fork & Clone</h3>
              </div>
              <button
                onClick={() => copyToClipboard('git clone https://github.com/YOUR-USERNAME/JobTrackr.io.git', 'clone')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-pink-300 transition-colors"
                title="Copy command"
              >
                {copiedCmd === 'clone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Fork the repository on GitHub, then clone your fork locally:
            </p>
            <pre className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-pink-200 overflow-x-auto">
              git clone https://github.com/YOUR-USERNAME/JobTrackr.io.git
            </pre>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold flex items-center justify-center border border-pink-500/30">
                  2
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Install Dependencies</h3>
              </div>
              <button
                onClick={() => copyToClipboard('npm run install:all', 'install')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-pink-300 transition-colors"
                title="Copy command"
              >
                {copiedCmd === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Install dependencies across root, frontend client, and backend server:
            </p>
            <pre className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-pink-200 overflow-x-auto">
              npm run install:all
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold flex items-center justify-center border border-pink-500/30">
                  3
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Launch Dev Servers</h3>
              </div>
              <button
                onClick={() => copyToClipboard('npm run dev', 'dev')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-pink-300 transition-colors"
                title="Copy command"
              >
                {copiedCmd === 'dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Run both frontend (:5173) and backend (:5000) concurrently:
            </p>
            <pre className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-pink-200 overflow-x-auto">
              npm run dev
            </pre>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold flex items-center justify-center border border-pink-500/30">
                  4
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Create Feature Branch</h3>
              </div>
              <button
                onClick={() => copyToClipboard('git checkout -b feat/your-feature-name', 'branch')}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-pink-300 transition-colors"
                title="Copy command"
              >
                {copiedCmd === 'branch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Follow Conventional Commits (<code className="text-pink-300 font-mono">feat:</code>, <code className="text-pink-300 font-mono">fix:</code>, <code className="text-pink-300 font-mono">docs:</code>):
            </p>
            <pre className="p-3 rounded-xl bg-black/40 border border-purple-500/20 text-[11px] font-mono text-pink-200 overflow-x-auto">
              git checkout -b feat/your-feature-name
            </pre>
          </div>
        </div>
      </div>

      {/* Contribution Ideas */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#130826]/90 border border-pink-500/25 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#dc2743] to-[#bc1888] text-white shadow-md shadow-pink-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Open Issues & Ideas to Implement</h2>
            <p className="text-xs text-slate-400">Great first pull requests for developers to build and add to their portfolio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contributionIdeas.map((idea, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/5 border border-purple-500/20 hover:border-pink-500/40 transition-all hover:bg-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white">{idea.title}</h3>
                <span className="px-2 py-0.5 rounded-md bg-pink-500/15 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                  {idea.tag}
                </span>
              </div>
              <p className="text-xs text-slate-300/80 leading-relaxed">
                {idea.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-pink-500/20 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-slate-400">
            Have another feature idea? Open an issue on GitHub to discuss!
          </span>
          <a
            href="https://github.com/Kaviya-3016/JobTrackr.io/issues/new"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-pink-500/30 text-white font-bold text-xs transition-all hover:scale-105"
          >
            <Github className="w-4 h-4" />
            <span>Open GitHub Issue</span>
            <ExternalLink className="w-3 h-3 text-pink-400" />
          </a>
        </div>
      </div>

      {/* Tech Stack Summary */}
      <div className="p-6 rounded-3xl bg-[#130826]/75 border border-pink-500/20">
        <h3 className="text-xs font-bold uppercase tracking-wider text-pink-300/60 mb-4">
          Architecture & Technology Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'React 18',
            'TypeScript',
            'Tailwind CSS',
            'Node.js & Express (ESM)',
            'SQLite (Local Embedded)',
            'Supabase (Cloud PostgreSQL)',
            'Vite',
            'Lucide Icons',
            'Recharts',
            'jsPDF & autoTable',
            'MIT License'
          ].map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-pink-500/20 text-xs font-semibold text-pink-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ContributePage;
