import React from 'react';
import { Briefcase, Plus, Github, Sun, Moon } from 'lucide-react';
import type { User, Resume } from '../../types';

interface NavbarProps {
  user: User | null;
  activeResume: Resume | null;
  onNewApplication: () => void;
  onOpenAI?: () => void;
  onViewResume?: (resume: Resume) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeResume,
  onNewApplication,
  onOpenAI,
  onViewResume,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[#12081f]/85 backdrop-blur-md border-b border-pink-500/20 transition-colors duration-200">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-pink-600/30 text-white font-bold ring-2 ring-pink-500/30">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">
              JobTrackr.io
            </span>
          </div>
          <p className="text-xs text-pink-200/60 hidden sm:block">
            Career & Job Application Tracking System
          </p>
        </div>
      </div>

      {/* Action Buttons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Day / Night Theme Switcher */}
        <button
          type="button"
          onClick={onToggleTheme}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all hover:scale-105 active:scale-95 ${
            theme === 'light'
              ? 'bg-amber-100/90 text-amber-900 border-amber-300 shadow-sm shadow-amber-200/50 hover:bg-amber-200/80'
              : 'bg-[#22123d] text-pink-200 border-purple-500/40 shadow-sm shadow-purple-900/30 hover:bg-[#2c174f]'
          }`}
          title={theme === 'light' ? 'Switch to Night theme (Black)' : 'Switch to Day theme (White)'}
          aria-label="Toggle Day / Night theme"
        >
          {theme === 'light' ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Day</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#e1306c]" />
              <span>Night</span>
            </>
          )}
        </button>

        {/* New Application CTA with Instagram Gradient */}
        <button
          onClick={onNewApplication}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-pink-500/20">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white font-bold text-xs ring-2 ring-pink-500/30">
            {user?.name?.[0] || 'K'}
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-pink-100">{user?.name || 'Kavi'}</span>
              <a
                href={user?.portfolio || 'https://github.com/Kaviya-3016'}
                target="_blank"
                rel="noreferrer"
                className="text-pink-300/60 hover:text-pink-200"
                title="GitHub Portfolio"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            </div>
            <span className="text-[11px] text-pink-300/50 block max-w-[180px] truncate">
              ECE '26 Graduate
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
