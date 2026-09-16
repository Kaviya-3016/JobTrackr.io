import React from 'react';
import { Briefcase, Plus, Github, Sun, Moon, LogOut, Home, GitPullRequest } from 'lucide-react';
import type { User } from '../../types';

interface NavbarProps {
  user: User | null;
  onNewApplication: () => void;
  onOpenContribute?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onGoHome?: () => void;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onNewApplication,
  onOpenContribute,
  theme,
  onToggleTheme,
  onGoHome,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-[#12081f]/85 backdrop-blur-md border-b border-pink-500/20 transition-colors duration-200">
      {/* Brand Logo & Title */}
      <div
        onClick={onGoHome}
        className="flex items-center gap-3 cursor-pointer group select-none"
        title="Go to Home Page"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg shadow-pink-600/30 text-white font-bold ring-2 ring-pink-500/30 group-hover:scale-105 transition-transform">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">
              JobTrackr.io
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-[9px] font-bold text-pink-300">
              v1.0
            </span>
          </div>
          <p className="text-xs text-pink-200/60 hidden sm:block">
            Career & Job Application Tracking System
          </p>
        </div>
      </div>

      {/* Action Buttons & User Profile */}
      <div className="flex items-center gap-3">
        {/* Home Navigation button */}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-pink-500/20 text-xs font-semibold text-pink-200 hover:text-white transition-all"
            title="Landing Home Page"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Home</span>
          </button>
        )}

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
              <span className="hidden sm:inline">Day</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#e1306c]" />
              <span className="hidden sm:inline">Night</span>
            </>
          )}
        </button>

        {user ? (
          <>
            {/* New Application CTA */}
            <button
              onClick={onNewApplication}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Application</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Contribute to Open Source CTA */}
            {onOpenContribute && (
              <button
                onClick={onOpenContribute}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-pink-500/30 text-xs font-semibold text-pink-200 hover:text-white transition-all cursor-pointer"
                title="Contribute to this open-source project"
              >
                <GitPullRequest className="w-3.5 h-3.5 text-pink-400" />
                <span className="hidden lg:inline">Contribute</span>
              </button>
            )}

            {/* User Card */}
            <div
              onClick={onOpenContribute}
              className="flex items-center gap-2.5 pl-2 border-l border-pink-500/20 cursor-pointer group select-none"
              title="View Profile & Open-Source Hub"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white font-bold text-xs ring-2 ring-pink-500/30 group-hover:scale-105 transition-transform">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-pink-100 group-hover:text-pink-300 transition-colors">{user?.name || 'User'}</span>
                  {user?.portfolio && (
                    <a
                      href={user.portfolio.startsWith('http') ? user.portfolio : `https://${user.portfolio}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-pink-300/60 hover:text-pink-200"
                      title="Portfolio"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <span className="text-[11px] text-pink-300/50 block max-w-[140px] truncate">
                  {user?.email}
                </span>
              </div>

              {/* Logout button */}
              {onLogout && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLogout();
                  }}
                  className="p-1.5 ml-1 rounded-lg text-pink-300/60 hover:text-pink-100 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth?.('signin')}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-pink-200 hover:text-white hover:bg-white/5 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth?.('signup')}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
