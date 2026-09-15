import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  MailCheck,
  CalendarCheck,
  PieChart as PieIcon,
  Flame
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { Heatmap } from '../components/analytics/Heatmap';
import type {
  AnalyticsOverview,
  HeatmapDay,
  DailyCount,
  WeeklySummary,
  MonthlySummary
} from '../types';
import { api } from '../services/api';

interface AnalyticsPageProps {
  overview: AnalyticsOverview | null;
  heatmapDays: HeatmapDay[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  overview,
  heatmapDays
}) => {
  const [dailyCounts, setDailyCounts] = useState<DailyCount[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklySummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlySummary[]>([]);
  const [replyStats, setReplyStats] = useState<any>(null);
  const [interviewStats, setInterviewStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const [dRes, wRes, mRes, rRes, iRes] = await Promise.all([
          api.getDailyCounts(60),
          api.getWeeklySummary(),
          api.getMonthlySummary(),
          api.getReplyAccuracy(),
          api.getInterviewStats()
        ]);
        setDailyCounts(dRes.dailyCounts || []);
        setWeeklyData(wRes.weeklySummary || []);
        setMonthlyData(mRes.monthlySummary || []);
        setReplyStats(rRes);
        setInterviewStats(iRes);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-pink-500/25">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Application Analytics & Velocity Insights
          </h2>
          <p className="text-xs text-slate-300/80">
            Visual trends, response rate accuracy, interview conversions, and 365-day application frequency
          </p>
        </div>
      </div>

      {/* 1. GitHub-style Heatmap (365 Days) */}
      <Heatmap days={heatmapDays} />

      {/* 2. Key Ratio: Reply Accuracy */}
      <div className="grid grid-cols-1 gap-5">
        {/* Reply Accuracy Meter */}
        <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-300 border border-pink-500/30">
                <MailCheck className="w-5 h-5 text-[#e1306c]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Reply Mail Accuracy Rate
                </h3>
                <p className="text-xs text-slate-400">
                  (Replies Received / Total Applications) * 100
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black bg-gradient-to-r from-[#f09433] via-[#e1306c] to-[#833ab4] bg-clip-text text-transparent">
                {overview?.replyAccuracy || 0}%
              </span>
              <span className="text-[11px] text-pink-300/70 block font-medium">Overall</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Current Reply Rate</span>
              <span className="font-semibold text-pink-300">
                {overview?.repliedApplications} of {overview?.totalApplications} Responded
              </span>
            </div>
            <div className="w-full bg-[#22123d] rounded-full h-3 overflow-hidden border border-purple-500/20">
              <div
                className="bg-gradient-to-r from-[#833ab4] via-[#e1306c] to-[#f09433] h-full rounded-full transition-all duration-700 shadow-md shadow-pink-500/30"
                style={{ width: `${overview?.replyAccuracy || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Portal accuracy table */}
          {replyStats?.portalAccuracy && (
            <div className="pt-3 border-t border-purple-500/20 space-y-2 text-xs">
              <span className="text-[11px] font-semibold text-pink-300/80 block uppercase tracking-wider">
                Accuracy by Job Portal
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {replyStats.portalAccuracy.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 flex items-center justify-between"
                  >
                    <span className="text-slate-300 truncate max-w-[100px]">{p.portal}</span>
                    <span className="font-bold text-[#f09433]">{p.accuracy_pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Daily Applications Trend Chart */}
      <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#e1306c]" />
              Daily Application Trend (Time Series)
            </h3>
            <p className="text-xs text-slate-400">
              Application submissions over time
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyCounts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e1306c" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#833ab4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a1645" />
              <XAxis dataKey="date" stroke="#9a81b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#9a81b8" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#160a2c',
                  borderColor: 'rgba(225, 48, 108, 0.4)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: '#fdf4f9'
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Applications"
                stroke="#e1306c"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Weekly and Monthly Aggregations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weekly Chart */}
        <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 shadow-xl backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-white">
            Applications per Week
          </h3>
          <p className="text-xs text-slate-400">
            Total applications vs replies received per week
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a1645" />
                <XAxis dataKey="week" stroke="#9a81b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#9a81b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#160a2c',
                    borderColor: 'rgba(225, 48, 108, 0.4)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fdf4f9'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#e2d4f0' }} />
                <Bar dataKey="total" name="Total Applied" fill="#833ab4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="replies" name="Replies" fill="#e1306c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 shadow-xl backdrop-blur-md space-y-3">
          <h3 className="text-sm font-bold text-white">
            Monthly Applications & Offers
          </h3>
          <p className="text-xs text-slate-400">
            Monthly volume and offer conversions
          </p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a1645" />
                <XAxis dataKey="month" stroke="#9a81b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#9a81b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#160a2c',
                    borderColor: 'rgba(225, 48, 108, 0.4)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fdf4f9'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#e2d4f0' }} />
                <Bar dataKey="total" name="Total Applied" fill="#833ab4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="replies" name="Replies" fill="#e1306c" radius={[6, 6, 0, 0]} />
                <Bar dataKey="offers" name="Offers" fill="#f09433" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
