import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  MapPin,
  Building2,
  Calendar,
  AlertCircle,
  Clock,
  Lightbulb,
  Edit2,
  Trash2,
  FileText,
  Eye,
  CheckCircle2
} from 'lucide-react';
import type { Interview, JobApplication, Resume } from '../types';

interface InterviewsPageProps {
  interviews: Interview[];
  applications: JobApplication[];
  resumes: Resume[];
  onOpenNewInterview: (mode?: 'interview' | 'walk-in') => void;
  onEditInterview: (interview: Interview) => void;
  onDeleteInterview: (id: string) => Promise<void>;
  onOpenFeedback: (interview: Interview) => void;
  onViewResume?: (resume: Resume) => void;
}

export const InterviewsPage: React.FC<InterviewsPageProps> = ({
  interviews,
  applications,
  resumes,
  onOpenNewInterview,
  onEditInterview,
  onDeleteInterview,
  onOpenFeedback,
  onViewResume
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = interviews.filter((iv) => {
    const matchStatus =
      statusFilter === 'All' ||
      iv.interview_status.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === 'Offer' && iv.interview_status.toLowerCase().includes('offer'));

    const matchType =
      typeFilter === 'All' ||
      (typeFilter === 'Walk-in' && Boolean(iv.is_walk_in)) ||
      (typeFilter === 'Virtual' && !Boolean(iv.is_walk_in));

    return matchStatus && matchType;
  });

  const getStatusBadge = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('offer')) {
      return 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 text-amber-200 border-amber-500/40';
    }
    if (lower.includes('scheduled')) {
      return 'bg-purple-500/20 text-pink-200 border-pink-500/40';
    }
    if (lower.includes('rescheduled')) {
      return 'bg-amber-500/20 text-amber-200 border-amber-500/40';
    }
    if (lower.includes('attended')) {
      return 'bg-violet-500/20 text-violet-200 border-violet-500/40';
    }
    if (lower.includes('rejected')) {
      return 'bg-rose-950/40 text-rose-300 border-rose-800/50';
    }
    return 'bg-[#22133b] text-pink-200 border-pink-500/30';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with 2 Distinct Instagram-Themed Log Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <span>Interview & Walk-in Tracker</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-pink-200/60 mt-0.5">
            Monitor scheduled interviews, walk-in drives, venue details, and resumes stored in database
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Button 1: Scheduled Interview */}
          <button
            onClick={() => onOpenNewInterview('interview')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-pink-600/25 transition-all hover:scale-[1.02]"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>+ Log Interview</span>
          </button>

          {/* Button 2: Walk-in Drive */}
          <button
            onClick={() => onOpenNewInterview('walk-in')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/25 transition-all hover:scale-[1.02]"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>+ Log Walk-in</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#150d24]/85 border border-pink-200 dark:border-pink-500/25 text-xs shadow-md shadow-pink-500/5 dark:shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-600 dark:text-pink-300/60 mr-1 font-semibold">Status:</span>
          {['All', 'Scheduled', 'Rescheduled', 'Attended', 'Offer', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 text-pink-700 dark:text-pink-200 border border-pink-500/40 font-bold shadow-sm shadow-pink-500/20'
                  : 'bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-pink-700 border border-slate-200 dark:bg-[#22133b]/60 dark:text-slate-300 dark:hover:text-pink-200 dark:hover:bg-pink-500/10 dark:border-transparent'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 dark:text-pink-300/60 mr-1 font-semibold">Type:</span>
          {['All', 'Virtual', 'Walk-in'].map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-3 py-1 rounded-lg transition-all ${
                typeFilter === tp
                  ? 'bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-600/20 text-amber-700 dark:text-amber-200 border border-amber-500/40 font-bold shadow-sm'
                  : 'bg-slate-100 hover:bg-pink-50 text-slate-700 hover:text-pink-700 border border-slate-200 dark:bg-[#22133b]/60 dark:text-slate-300 dark:hover:text-pink-200 dark:hover:bg-pink-500/10 dark:border-transparent'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>
      </div>

      {/* Interviews List / Cards */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((iv) => {
            const loc = iv.location || iv.job_location;
            const resumeObj =
              resumes.find((r) => r.id === iv.resume_used_id) ||
              (iv.resume_name
                ? {
                    id: iv.resume_used_id || 'interview-resume',
                    user_id: '',
                    resume_name: iv.resume_name,
                    file_url: iv.resume_file_url || '',
                    is_active: 1,
                    uploaded_date: iv.interview_date
                  }
                : null);

            return (
              <div
                key={iv.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#170e28]/85 border border-pink-200 dark:border-pink-500/20 hover:border-pink-400 dark:hover:border-pink-500/40 transition-all space-y-3 shadow-md shadow-pink-500/5 dark:shadow-xl backdrop-blur-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`p-2.5 rounded-2xl border flex-shrink-0 ${
                        iv.is_walk_in
                          ? 'bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 border-rose-500/30 text-rose-500 dark:text-rose-300'
                          : 'bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-300'
                      }`}
                    >
                      {iv.is_walk_in ? (
                        <MapPin className="w-5 h-5" />
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{iv.company_name}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            iv.interview_status
                          )}`}
                        >
                          {iv.interview_status}
                        </span>
                        {iv.is_walk_in ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 dark:bg-gradient-to-r dark:from-amber-500/15 dark:via-rose-500/15 dark:to-purple-500/15 dark:text-amber-200 dark:border-amber-500/30 text-[10px] font-bold">
                            📍 Walk-in / In-Person
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 dark:bg-[#24133b] dark:text-purple-200 dark:border-purple-500/30 text-[10px] font-medium">
                            💻 {iv.interview_type || 'Virtual'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-pink-200/80 mt-0.5 font-medium">
                        {iv.role_applied}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Location Badge */}
                    {loc && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#22133b] text-xs text-slate-700 dark:text-pink-200 border border-slate-200/80 dark:border-pink-500/20">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                        <span>{loc}</span>
                      </div>
                    )}

                    {/* Interviewed Day */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-[#22133b] text-xs text-slate-700 dark:text-pink-200 border border-slate-200/80 dark:border-pink-500/20">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                      <span>{iv.interview_date}</span>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => onEditInterview(iv)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-pink-300/60 dark:hover:text-pink-200 dark:hover:bg-pink-500/10 rounded-lg transition-colors"
                      title="Edit Interview"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete interview log for ${iv.company_name}?`)) {
                          onDeleteInterview(iv.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-pink-300/60 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Attached Resume Watch Bar */}
                {resumeObj && (
                  <div className="flex items-center justify-between p-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#211138]/70 border border-pink-200 dark:border-pink-500/30 text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-pink-500/15 text-pink-500 dark:text-pink-400 border border-pink-500/25 flex-shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-slate-900 dark:text-white font-semibold truncate block">
                          {resumeObj.resume_name}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-pink-300/80 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-rose-500 dark:text-rose-400" /> Stored in Database
                        </span>
                      </div>
                    </div>
                    {onViewResume && (
                      <button
                        type="button"
                        onClick={() => onViewResume(resumeObj)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-pink-600/30 hover:scale-[1.02] flex-shrink-0"
                        title="Watch / Preview this resume"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Watch Resume</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Walk-in Venue & POC Box */}
                {iv.is_walk_in && iv.walk_in_details && (
                  <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-gradient-to-r dark:from-rose-950/40 dark:to-amber-950/40 border border-amber-300 dark:border-rose-500/35 text-xs space-y-1">
                    <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Walk-in Venue & Reporting POC Instructions:
                    </span>
                    <p className="text-slate-800 dark:text-pink-100 leading-relaxed whitespace-pre-line">
                      {iv.walk_in_details}
                    </p>
                  </div>
                )}

                {/* General Interview Notes */}
                {iv.notes && (
                  <div className="text-xs text-slate-700 dark:text-pink-200/90 bg-slate-50 dark:bg-[#22133b]/50 p-3 rounded-xl border border-slate-200 dark:border-pink-500/20">
                    <span className="text-slate-500 dark:text-pink-300/60 block text-[11px] font-medium mb-0.5">
                      Notes:
                    </span>
                    <p className="whitespace-pre-line">{iv.notes}</p>
                  </div>
                )}

                {/* Rejection Feedback Box if Rejected */}
                {iv.interview_status.toLowerCase() === 'rejected' && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                        Rejection Reason: {iv.rejection_reason || 'Not documented yet'}
                      </span>
                      <button
                        onClick={() => onOpenFeedback(iv)}
                        className="text-[11px] font-medium text-pink-600 dark:text-pink-300 hover:text-pink-800 dark:hover:text-white underline"
                      >
                        {iv.rejection_reason ? 'Edit Feedback' : 'Add Feedback & Notes'}
                      </button>
                    </div>
                    {iv.feedback_notes && (
                      <p className="text-slate-700 dark:text-pink-200/80 text-[11px] leading-relaxed">
                        {iv.feedback_notes}
                      </p>
                    )}
                    {iv.improvement_suggestions && (
                      <div className="pt-2 border-t border-rose-200 dark:border-rose-900/30 flex items-start gap-2 text-amber-800 dark:text-amber-200 text-[11px]">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{iv.improvement_suggestions}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#170e28]/70 border border-pink-200 dark:border-pink-500/20 text-slate-600 dark:text-pink-300/60 text-xs space-y-3 shadow-md shadow-pink-500/5 dark:shadow-none">
            <CalendarCheck className="w-10 h-10 text-pink-500 dark:text-pink-400/40 mx-auto" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No interviews or walk-ins found matching your filters.</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onOpenNewInterview('interview')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-pink-600/30 hover:scale-[1.02] transition-transform"
              >
                + Log Interview
              </button>
              <button
                onClick={() => onOpenNewInterview('walk-in')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-orange-500/30 hover:scale-[1.02] transition-transform"
              >
                + Log Walk-in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
