import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  BarChart3,
  FileText,
  CalendarCheck,
  Bookmark,
  Download
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'applications'
  | 'analytics'
  | 'resumes'
  | 'interviews'
  | 'waitlist'
  | 'export';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  appCount: number;
  offerCount: number;
  interviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  appCount,
  offerCount,
  interviewCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'applications' as NavTab,
      label: 'Applications',
      icon: Briefcase,
      badge: appCount > 0 ? String(appCount) : null
    },
    {
      id: 'analytics' as NavTab,
      label: 'Analytics & Heatmap',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'resumes' as NavTab,
      label: 'Resume Hub',
      icon: FileText,
      badge: null
    },
    {
      id: 'interviews' as NavTab,
      label: 'Interviews & Walk-ins',
      icon: CalendarCheck,
      badge: interviewCount > 0 ? String(interviewCount) : null
    },
    {
      id: 'waitlist' as NavTab,
      label: 'Wishlist / Apply Later',
      icon: Bookmark,
      badge: null
    },
    {
      id: 'export' as NavTab,
      label: 'Export Center',
      icon: Download,
      badge: 'PDF'
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#12081f]/75 border-r border-pink-500/20 flex flex-col justify-between p-4 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Navigation Items */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-pink-300/50 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 text-pink-200 border border-pink-500/40 shadow-sm shadow-pink-500/25 font-bold'
                    : 'text-slate-300 hover:text-pink-200 hover:bg-pink-500/10 hover:border-pink-500/20 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-pink-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive
                        ? 'bg-pink-500/30 text-pink-200 border border-pink-500/40'
                        : item.badge === 'PDF'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-900/40 text-purple-300 border border-purple-800/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Footer Summary */}
      <div className="pt-3 border-t border-pink-500/20 text-[11px] text-pink-300/60 flex items-center justify-between">
        <span>SDE Search • Kavi</span>
        <span className="text-pink-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span>
          Active
        </span>
      </div>
    </aside>
  );
};
