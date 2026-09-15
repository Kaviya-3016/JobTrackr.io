import React from 'react';
import {
  Briefcase,
  MailCheck,
  CalendarCheck,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import type { AnalyticsOverview, JobApplication, Interview } from '../types';

interface DashboardPageProps {
  analytics: AnalyticsOverview | null;
  applications: JobApplication[];
  interviews: Interview[];
  onNavigateTab: (tab: any) => void;
  onOpenNewApp: () => void;
  onEditApp: (app: JobApplication) => void;
}

const STATUS_COLORS: { [key: string]: string } = {
  'Applied': '#833AB4', // Royal Purple
  'In Progress': '#F77737', // Sunset Orange
  'Interview Scheduled': '#E1306C', // Vibrant Magenta
  'Offer': '#FCAF45', // Warm Gold/Amber
  'Rejected': '#64748b' // Slate
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analytics,
  applications,
  interviews,
  onNavigateTab,
  onOpenNewApp,
  onEditApp
}) => {
  const recentApps = applications.slice(0, 6);
  const upcomingInterviews = interviews
    .filter(i => i.interview_status === 'Scheduled')
    .slice(0, 3);

  const pieData = analytics?.statusBreakdown?.map(item => ({
    name: item.status,
    value: item.count,
    color: STATUS_COLORS[item.status] || '#64748b'
  })) || [];

  const portalData = analytics?.portalBreakdown?.map(item => ({
    portal: item.portal,
    count: item.count
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner for Kavi */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-[#1c0d38] dark:via-[#240d34] dark:to-[#160829] border border-pink-200 dark:border-pink-500/25 shadow-md shadow-pink-500/5 dark:shadow-xl dark:shadow-purple-950/40 relative overflow-hidden transition-all">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
              Welcome back, Kavi 👋
            </h2>
            <p className="text-xs text-slate-600 dark:text-pink-100/80 max-w-xl leading-relaxed">
              You have submitted <strong className="text-slate-900 dark:text-white font-bold">{analytics?.totalApplications || 0}</strong> applications with a <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] to-[#e1306c] font-extrabold">{analytics?.replyAccuracy || 0}%</strong> reply rate.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenNewApp}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02]"
            >
              + Log Application
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div className="p-4 rounded-2xl bg-[#140b25]/80 border border-purple-500/25 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-purple-300/80">Total Applications</span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">
              {analytics?.totalApplications || 0}
            </span>
            <span className="text-xs font-medium text-pink-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +100% S.No
            </span>
          </div>
          <span className="text-[11px] text-pink-200/60 mt-1 block">
            Across 5+ major hiring portals
          </span>
        </div>

        {/* Reply Accuracy */}
        <div className="p-4 rounded-2xl bg-[#140b25]/80 border border-pink-500/25 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-pink-300/80">Reply Accuracy Rate</span>
            <div className="p-2 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
              <MailCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-pink-400">
              {analytics?.replyAccuracy || 0}%
            </span>
            <span className="text-xs text-pink-200/70">
              ({analytics?.repliedApplications || 0} replies)
            </span>
          </div>
          <span className="text-[11px] text-pink-200/60 mt-1 block">
            {(analytics?.repliedApplications || 0)} / {(analytics?.totalApplications || 1)} responded
          </span>
        </div>

        {/* Active Interviews */}
        <div className="p-4 rounded-2xl bg-[#140b25]/80 border border-rose-500/25 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-rose-300/80">Interviews Scheduled</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-300">
              {analytics?.scheduledInterviews || 0}
            </span>
            <span className="text-xs text-rose-200/70">
              ({analytics?.totalInterviews || 0} total logged)
            </span>
          </div>
          <span className="text-[11px] text-rose-400 font-medium mt-1 block">
            Includes In-Person & Walk-ins
          </span>
        </div>

        {/* Offers Received */}
        <div className="p-4 rounded-2xl bg-[#140b25]/80 border border-orange-500/25 glass-card-hover">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-orange-300/80">Offers & Conversions</span>
            <div className="p-2 rounded-xl bg-[#f09433]/15 text-[#fca052] border border-orange-500/30">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#f09433]">
              {analytics?.offers || 0} Offer
            </span>
            <span className="text-xs font-semibold text-pink-400">
              Success: {analytics?.interviewSuccessRate || 0}%
            </span>
          </div>
          <span className="text-[11px] text-orange-200/60 mt-1 block truncate">
            {analytics?.offers ? `${analytics.offers} Offer Received` : 'Ready to Join'}
          </span>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Doughnut Chart */}
        <div className="p-5 rounded-2xl bg-[#140b25]/80 border border-pink-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-white">
              Applications by Status
            </h3>
            <span className="text-[11px] text-pink-300/70">
              {analytics?.totalApplications} Total
            </span>
          </div>

          <div className="h-44 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#160a2c',
                    borderColor: 'rgba(225, 48, 108, 0.3)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-500/20 text-[11px]">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-slate-400 truncate">{item.name}:</span>
                <span className="font-semibold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portal Distribution Bar Chart */}
        <div className="p-5 rounded-2xl bg-[#140b25]/80 border border-pink-500/20 lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-semibold text-white">
                Applications by Job Portal
              </h3>
              <p className="text-[11px] text-pink-300/70">
                Volume breakdown across job discovery platforms
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="portal" stroke="#833ab4" fontSize={10} tickLine={false} />
                <YAxis stroke="#833ab4" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(225, 48, 108, 0.08)' }}
                  contentStyle={{
                    backgroundColor: '#160a2c',
                    borderColor: 'rgba(225, 48, 108, 0.3)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc'
                  }}
                />
                <Bar dataKey="count" fill="#e1306c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-slate-400">
            <span>Primary Sources: LinkedIn & Direct Company Careers</span>
            <span className="text-pink-400 font-medium">Top Response: Wellfound & Careers</span>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews Alert & Recent Applications Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Interviews Highlights */}
        <div className="p-5 rounded-2xl bg-[#140b25]/80 border border-pink-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              Upcoming Interviews
            </h3>
            <button
              onClick={() => onNavigateTab('interviews')}
              className="text-[11px] text-pink-400 hover:text-pink-300 font-medium"
            >
              View All ({interviews.length})
            </button>
          </div>

          {upcomingInterviews.length > 0 ? (
            <div className="space-y-2.5">
              {upcomingInterviews.map((iv) => (
                <div
                  key={iv.id}
                  className="p-3 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 space-y-1.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{iv.company_name}</h4>
                      <p className="text-[11px] text-pink-200/70">{iv.round_name}</p>
                    </div>
                    {iv.is_walk_in ? (
                      <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-[#f09433]/20 to-[#dc2743]/20 text-[#fca052] text-[10px] font-bold border border-orange-500/30">
                        Walk-in
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-[#dc2743]/20 to-[#bc1888]/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                        Virtual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <CalendarCheck className="w-3 h-3 text-pink-400" />
                    <span>{iv.interview_date}</span>
                    {iv.job_location && (
                      <>
                        <span className="text-slate-600">•</span>
                        <MapPin className="w-3 h-3 text-[#f09433]" />
                        <span className="truncate max-w-[120px]">{iv.job_location}</span>
                      </>
                    )}
                  </div>
                  {iv.walk_in_details && (
                    <p className="text-[10px] text-orange-200 bg-[#25102a]/60 p-1.5 rounded-lg border border-orange-500/30 line-clamp-2">
                      📍 {iv.walk_in_details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No pending interviews scheduled. Keep applying!
            </p>
          )}
        </div>

        {/* Recent Applications Table */}
        <div className="p-5 rounded-2xl bg-[#140b25]/80 border border-pink-500/20 lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white">
              Recent Job Applications
            </h3>
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1"
            >
              <span>View All Applications</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-500/20 text-slate-400">
                  <th className="pb-2 font-medium">S.No</th>
                  <th className="pb-2 font-medium">Company</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Portal</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/15">
                {recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-pink-500/5 transition-colors">
                    <td className="py-2.5 font-bold text-slate-400">#{app.s_no}</td>
                    <td className="py-2.5 font-semibold text-slate-100">
                      {app.company_name}
                    </td>
                    <td className="py-2.5 text-slate-300 truncate max-w-[160px]">
                      {app.role_applied}
                    </td>
                    <td className="py-2.5 text-slate-400">{app.job_portal}</td>
                    <td className="py-2.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          app.application_status === 'Offer'
                            ? 'bg-orange-500/15 text-[#fca052] border-orange-500/30'
                            : app.application_status === 'Interview Scheduled'
                            ? 'bg-pink-500/15 text-pink-300 border-pink-500/30'
                            : app.application_status === 'In Progress'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : app.application_status === 'Rejected'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                        }`}
                      >
                        {app.application_status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onEditApp(app)}
                        className="text-slate-400 hover:text-pink-400 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
