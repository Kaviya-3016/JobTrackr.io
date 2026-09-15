import React, { useState } from 'react';
import { X, AlertCircle, Sparkles, Lightbulb } from 'lucide-react';
import type { Interview } from '../../types';

interface RejectionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview | null;
  onSubmit: (interviewId: string, feedback: {
    rejection_reason: string;
    detailed_notes: string;
    improvement_suggestions?: string;
  }) => Promise<void>;
}

export const RejectionFeedbackModal: React.FC<RejectionFeedbackModalProps> = ({
  isOpen,
  onClose,
  interview,
  onSubmit
}) => {
  const [reason, setReason] = useState(interview?.rejection_reason || '');
  const [detailedNotes, setDetailedNotes] = useState(interview?.feedback_notes || '');
  const [suggestions, setSuggestions] = useState(interview?.improvement_suggestions || '');
  const [submitting, setSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  if (!isOpen || !interview) return null;

  const handleGenerateAISuggestions = () => {
    setGeneratingAI(true);
    setTimeout(() => {
      let advice = "Focus on structuring answers with the STAR methodology (Situation, Task, Action, Result). ";
      if (reason.toLowerCase().includes('design') || reason.toLowerCase().includes('system') || detailedNotes.toLowerCase().includes('caching')) {
        advice += "Implement hands-on Redis caching and rate-limiting patterns in your Chess app to demonstrate distributed systems mastery.";
      } else if (reason.toLowerCase().includes('coding') || reason.toLowerCase().includes('dsa')) {
        advice += "Practice 30 minutes daily on NeetCode 150 focusing on tree and graph traversal with space-time complexity analysis.";
      } else {
        advice += "Quantify your technical achievements in software engineering projects with measurable UX improvements and performance benchmarks.";
      }
      setSuggestions(advice);
      setGeneratingAI(false);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await onSubmit(interview.id, {
        rejection_reason: reason.trim() || 'Technical Depth Gap',
        detailed_notes: detailedNotes.trim() || 'Not specified',
        improvement_suggestions: suggestions.trim() || undefined
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0515]/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#140b25] border border-pink-500/30 shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/25 bg-[#190d2e]/95">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#dc2743] to-[#833ab4] text-white shadow-md shadow-pink-500/20">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Log Rejection Feedback
              </h3>
              <p className="text-xs text-pink-200/70">
                {interview.company_name} • {interview.round_name || 'Interview Round'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-pink-200/90 mb-1">
              Primary Rejection Reason
            </label>
            <input
              type="text"
              placeholder="e.g. System Design Depth, Live Coding Speed, Concurrency"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-200/90 mb-1">
              Detailed Notes from Interviewer / Recruiter
            </label>
            <textarea
              rows={3}
              placeholder="What questions were asked? Where did the conversation stall?"
              value={detailedNotes}
              onChange={(e) => setDetailedNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-pink-200/90 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#f09433]" />
                Improvement Action Plan
              </label>
              <button
                type="button"
                onClick={handleGenerateAISuggestions}
                disabled={generatingAI}
                className="text-[11px] text-pink-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
              >
                <Sparkles className="w-3 h-3 text-[#f09433]" />
                {generatingAI ? 'Analyzing...' : 'AI Suggestion'}
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Action items for your next interview..."
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#22123d] text-slate-300 hover:text-white border border-purple-500/30 text-xs font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#dc2743] via-[#e1306c] to-[#833ab4] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition-all"
            >
              {submitting ? 'Saving...' : 'Save Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
