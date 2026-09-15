import React, { useState } from 'react';
import type { HeatmapDay } from '../../types';
import { Calendar, Flame, Zap } from 'lucide-react';

interface HeatmapProps {
  days: HeatmapDay[];
}

export const Heatmap: React.FC<HeatmapProps> = ({ days }) => {
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);

  // Group days into columns of 7 (weeks)
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  days.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Calculate statistics: total apps, active days, current streak
  const totalApplications = days.reduce((sum, d) => sum + d.count, 0);
  const activeDaysCount = days.filter(d => d.count > 0).length;

  // Calculate longest and current streak
  let maxStreak = 0;
  let currentStreak = 0;
  let runningStreak = 0;

  days.forEach((d) => {
    if (d.count > 0) {
      runningStreak++;
      if (runningStreak > maxStreak) maxStreak = runningStreak;
    } else {
      runningStreak = 0;
    }
  });

  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Instagram Gradient Cell Progression
  const getCellColor = (level: number, count: number) => {
    if (count === 0) return 'bg-slate-200/70 border border-slate-300/50 dark:bg-[#201338]/80 dark:border-purple-900/30 hover:border-pink-500/60';
    if (level === 1) return 'bg-[#833ab4] border border-[#9a4fc9] text-white';
    if (level === 2) return 'bg-[#bc1888] border border-[#d42ea0] text-white';
    if (level === 3) return 'bg-[#e1306c] border border-[#fa3e8c] shadow-sm shadow-pink-500/30 text-white';
    return 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#dc2743] border border-amber-300 shadow-md shadow-rose-500/40 text-white font-bold';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#150d24]/85 border border-pink-200 dark:border-pink-500/25 backdrop-blur-md space-y-4 shadow-md dark:shadow-xl transition-all">
      {/* Header with Title and Streak KPI Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-pink-500/15 text-pink-500 dark:text-pink-400 border border-pink-500/30">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              Application Velocity Heatmap
              <span className="text-xs font-normal text-slate-500 dark:text-pink-300/60">(Last 365 Days)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-pink-200/60">
              {totalApplications} applications submitted across {activeDaysCount} active days
            </p>
          </div>
        </div>

        {/* Streaks */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50/90 dark:bg-[#22133b] border border-amber-200 dark:border-amber-500/30 text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="text-amber-900/70 dark:text-pink-300/60 font-medium">Current Streak:</span>
            <span className="font-bold text-amber-700 dark:text-amber-300">{currentStreak} days</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-50/90 dark:bg-[#22133b] border border-pink-200 dark:border-pink-500/30 text-xs">
            <Zap className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" />
            <span className="text-pink-900/70 dark:text-pink-300/60 font-medium">Max Streak:</span>
            <span className="font-bold text-pink-700 dark:text-pink-300">{maxStreak} days</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="inline-flex gap-1.5 items-start min-w-[760px]">
          {/* Day of week labels */}
          <div className="flex flex-col gap-1.5 pr-2 pt-1 text-[9px] font-bold text-slate-500 dark:text-pink-300/50 select-none">
            {dayLabels.map((day, idx) => (
              <span key={idx} className="h-3 leading-3">
                {idx % 2 === 1 ? day : ''}
              </span>
            ))}
          </div>

          {/* Week Columns */}
          <div className="flex gap-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3 h-3 rounded-[3px] heatmap-cell cursor-pointer transition-colors duration-150 ${getCellColor(
                      day.level,
                      day.count
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Tooltip details & Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs pt-2 border-t border-pink-200 dark:border-pink-500/20">
        <div className="text-slate-800 dark:text-pink-100 font-medium min-h-[20px] flex items-center gap-2">
          {hoveredDay ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-rose-500"></span>
              <span>
                <strong className="text-pink-600 dark:text-amber-300 font-bold">{hoveredDay.count} application{hoveredDay.count === 1 ? '' : 's'}</strong> on{' '}
                {new Date(hoveredDay.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </>
          ) : (
            <span className="text-slate-500 dark:text-pink-300/50">Hover over any square to view application count</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-pink-300/60 font-medium">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-200/70 border border-slate-300/50 dark:bg-[#201338]/80 dark:border-purple-900/30" title="0 apps"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#833ab4] border border-[#9a4fc9]" title="1 app"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#bc1888] border border-[#d42ea0]" title="2 apps"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-[#e1306c] border border-[#fa3e8c]" title="3 apps"></div>
          <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#dc2743] border border-amber-300" title="4+ apps"></div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
};
