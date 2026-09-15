import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Briefcase,
  TrendingUp,
  ArrowRight,
  BookOpen,
  RefreshCw
} from 'lucide-react';
import type {
  ResumeFeedbackResult,
  RoleRecommendation
} from '../types';
import { api } from '../services/api';

export const AIInsightsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'feedback' | 'rejections'>('roles');
  const [roles, setRoles] = useState<RoleRecommendation[]>([]);
  const [feedback, setFeedback] = useState<ResumeFeedbackResult | null>(null);
  const [rejectionAnalysis, setRejectionAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllAIData();
  }, []);

  const loadAllAIData = async () => {
    try {
      setLoading(true);
      const [roleRes, fbRes, rejRes] = await Promise.all([
        api.getRoleRecommendations(),
        api.getResumeFeedback(),
        api.getRejectionAnalysis()
      ]);
      setRoles(roleRes.recommendations || []);
      setFeedback(fbRes);
      setRejectionAnalysis(rejRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-pink-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              AI Career Co-Pilot
            </h2>
            <p className="text-xs text-slate-300/80">
              Powered by OpenAI & intelligent heuristic analysis tailored for 2026 graduates
            </p>
          </div>
        </div>

        <button
          onClick={loadAllAIData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[#22123d] hover:bg-[#2e1852] text-pink-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all self-start sm:self-auto shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh AI Analysis</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-purple-500/20 pb-3">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'roles'
              ? 'bg-gradient-to-r from-[#e1306c] to-[#833ab4] text-white shadow-md shadow-pink-500/25'
              : 'bg-[#180e2d]/80 text-slate-300 hover:text-white border border-purple-500/25'
          }`}
        >
          Role Recommendations
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'feedback'
              ? 'bg-gradient-to-r from-[#e1306c] to-[#833ab4] text-white shadow-md shadow-pink-500/25'
              : 'bg-[#180e2d]/80 text-slate-300 hover:text-white border border-purple-500/25'
          }`}
        >
          Resume Bullet Feedback
        </button>
        <button
          onClick={() => setActiveTab('rejections')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rejections'
              ? 'bg-gradient-to-r from-[#e1306c] to-[#833ab4] text-white shadow-md shadow-pink-500/25'
              : 'bg-[#180e2d]/80 text-slate-300 hover:text-white border border-purple-500/25'
          }`}
        >
          Rejection Pattern Analysis
        </button>
      </div>

      {/* TAB 1: ROLE RECOMMENDATIONS */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#1c1032]/80 border border-purple-500/30 text-xs text-pink-200 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#f09433] flex-shrink-0" />
            <p>
              Based on your <strong className="text-white">8.1 CGPA in ECE (2026)</strong>, full-stack software development skills, and application history, here are high-conversion roles with probability scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#140b25]/85 border border-pink-500/20 hover:border-pink-500/40 transition-all space-y-3 backdrop-blur-md shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{r.roleTitle}</h3>
                    <span className="text-xs font-semibold text-[#f09433]">
                      Target Salary: {r.expectedSalaryRange}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black bg-gradient-to-r from-[#f09433] via-[#e1306c] to-[#833ab4] bg-clip-text text-transparent">
                      {r.matchProbability}%
                    </span>
                    <span className="text-[10px] text-pink-300/70 block font-medium">Match Score</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{r.reason}</p>

                <div>
                  <span className="text-[11px] font-bold text-pink-300/80 block mb-1.5 uppercase tracking-wider">
                    Key Technical Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {r.keySkillsRequired.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-[#22123d] text-pink-200 text-[11px] border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target Companies:</span>
                  <span className="text-slate-200 font-medium">{r.sampleCompanies?.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: RESUME BULLET FEEDBACK */}
      {activeTab === 'feedback' && feedback && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 space-y-2 backdrop-blur-md shadow-xl">
            <span className="text-xs font-bold text-[#e1306c] uppercase tracking-wider">
              FAANG Hiring Coach Summary:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{feedback.summary}</p>
          </div>

          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#f09433]" />
            Bullet Point Rewrites (Google XYZ Formula: Accomplished X by doing Y as measured by Z)
          </h3>

          <div className="space-y-3">
            {feedback.bulletPointCritique.map((b, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#140b25]/85 border border-pink-500/20 space-y-2.5 backdrop-blur-md shadow-xl"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Original / Weak Line:
                  </span>
                  <p className="text-xs text-slate-400 italic bg-rose-950/25 p-2.5 rounded-xl border border-rose-900/35">
                    "{b.originalExample}"
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#e1306c]" /> High-Impact Recommended Rewrite:
                  </span>
                  <p className="text-xs text-pink-100 font-medium bg-gradient-to-r from-[#833ab4]/30 to-[#e1306c]/30 p-2.5 rounded-xl border border-pink-500/40">
                    "{b.suggestedRewrite}"
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 pt-1">
                  <strong className="text-slate-200">Why this works:</strong> {b.reason}
                </p>
              </div>
            ))}
          </div>

          {/* Action verbs */}
          <div className="p-4 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 space-y-2 backdrop-blur-md">
            <span className="text-xs font-bold text-pink-200 uppercase tracking-wider">
              High-Impact Power Verbs for Your Resume:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {feedback.actionVerbRecommendations.map((verb, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#22123d] text-pink-300 text-xs border border-purple-500/30 font-semibold"
                >
                  {verb}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REJECTION PATTERNS */}
      {activeTab === 'rejections' && rejectionAnalysis && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 space-y-3 backdrop-blur-md">
            <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Observed Rejection & Technical Gap Patterns:
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {rejectionAnalysis.commonPatterns?.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 space-y-3 backdrop-blur-md">
            <h3 className="text-sm font-bold text-pink-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#e1306c]" />
              Recommended Technical Action Plan:
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {rejectionAnalysis.actionPlan?.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e1306c] mt-1.5 flex-shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 space-y-3 backdrop-blur-md">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#f09433]" />
              Curated Study & Practice References:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {rejectionAnalysis.recommendedResources?.map((res: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-slate-200 font-medium"
                >
                  {res}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
