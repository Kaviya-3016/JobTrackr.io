import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  Globe,
  Calendar,
  FileText,
  IndianRupee,
  Upload,
  Eye,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import type { JobApplication, Resume } from '../../types';
import { api } from '../../services/api';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<JobApplication>) => Promise<void>;
  editingApp?: JobApplication | null;
  resumes: Resume[];
  onViewResume?: (resume: Resume) => void;
  onRefreshResumes?: () => Promise<void>;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingApp,
  resumes,
  onViewResume,
  onRefreshResumes
}) => {
  const [companyName, setCompanyName] = useState('');
  const [roleApplied, setRoleApplied] = useState('');
  const [jobLocation, setJobLocation] = useState('Remote');
  const [jobPortal, setJobPortal] = useState('LinkedIn');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [resumeUsedId, setResumeUsedId] = useState('');
  const [replyStatus, setReplyStatus] = useState('No Reply');
  const [applicationStatus, setApplicationStatus] = useState('Applied');
  const [salaryRange, setSalaryRange] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Inline resume upload state
  const [isUploadingResume, setIsUploadingResume] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadResumeName, setUploadResumeName] = useState('');
  const [uploadingState, setUploadingState] = useState(false);
  const [recentlyUploadedResume, setRecentlyUploadedResume] = useState<Resume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingApp) {
      setCompanyName(editingApp.company_name);
      setRoleApplied(editingApp.role_applied);
      setJobLocation(editingApp.job_location || 'Remote');
      setJobPortal(editingApp.job_portal || 'LinkedIn');
      setApplicationDate(editingApp.application_date);
      setResumeUsedId(editingApp.resume_used_id || '');
      setReplyStatus(editingApp.reply_status || 'No Reply');
      setApplicationStatus(editingApp.application_status || 'Applied');
      setSalaryRange(editingApp.salary_range || '');
      setNotes(editingApp.notes || '');
      setIsUploadingResume(!editingApp.resume_used_id);
    } else {
      setCompanyName('');
      setRoleApplied('');
      setJobLocation('Anna Nagar, Chennai');
      setJobPortal('LinkedIn');
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setResumeUsedId('');
      setIsUploadingResume(true);
      setReplyStatus('No Reply');
      setApplicationStatus('Applied');
      setSalaryRange('');
      setNotes('');
    }
    setError('');
    setUploadFile(null);
    setUploadResumeName('');
    setRecentlyUploadedResume(null);
  }, [editingApp, isOpen]);

  if (!isOpen) return null;

  const handleInlineResumeUpload = async (autoWatch = false) => {
    if (!uploadFile) {
      setError('Please choose a resume file to upload.');
      return;
    }

    try {
      setUploadingState(true);
      setError('');
      const formData = new FormData();
      formData.append('resumeFile', uploadFile);
      formData.append('resume_name', uploadResumeName || uploadFile.name);

      const result = await api.uploadResume(formData);
      setRecentlyUploadedResume(result.resume);
      setResumeUsedId(result.resume.id);
      setIsUploadingResume(false);
      setUploadFile(null);
      setUploadResumeName('');

      if (onRefreshResumes) {
        await onRefreshResumes();
      }

      if (autoWatch && onViewResume) {
        onViewResume(result.resume);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setUploadingState(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleApplied.trim()) {
      setError('Please provide both Company Name and Role Applied.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      let finalResumeId = resumeUsedId;

      // If user selected a file in upload box but didn't hit "Upload Now", upload it automatically
      if (isUploadingResume && uploadFile) {
        const formData = new FormData();
        formData.append('resumeFile', uploadFile);
        formData.append('resume_name', uploadResumeName || uploadFile.name);
        const uploadRes = await api.uploadResume(formData);
        finalResumeId = uploadRes.resume.id;
        if (onRefreshResumes) {
          await onRefreshResumes();
        }
      }

      await onSubmit({
        company_name: companyName.trim(),
        role_applied: roleApplied.trim(),
        job_location: jobLocation.trim(),
        job_portal: jobPortal.trim() || 'Direct Application',
        application_date: applicationDate,
        resume_used_id: finalResumeId || undefined,
        reply_status: replyStatus,
        application_status: applicationStatus,
        salary_range: salaryRange.trim() || undefined,
        notes: notes.trim() || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save application');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedResume = recentlyUploadedResume || resumes.find(r => r.id === resumeUsedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#140b25] border border-pink-500/25 shadow-2xl shadow-purple-950/60 overflow-hidden animate-slide-up flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-500/20 bg-gradient-to-r from-[#bc1888]/20 via-[#dc2743]/15 to-[#140b25] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white border border-pink-400/30">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {editingApp ? `Edit Application #${editingApp.s_no}` : 'Log New Job Application'}
              </h3>
              <p className="text-xs text-pink-200/70">
                {editingApp ? 'Update application progress and interview notes' : 'Auto-assigned sequential S.No for tracking'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-pink-400" />
                Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Syncfusion, Zoho, Google"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-all placeholder:text-slate-500"
                required
              />
            </div>

            {/* Role Applied */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-pink-400" />
                Role Applied *
              </label>
              <input
                type="text"
                placeholder="e.g. Network Engineer, Associate SDE"
                value={roleApplied}
                onChange={(e) => setRoleApplied(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 transition-all placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f09433]" />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Anna Nagar, Chennai"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              />
            </div>

            {/* Job Portal - Free Type Input with Datalist Suggestions */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-pink-400" />
                Job Portal *
              </label>
              <input
                type="text"
                list="portal-suggestions"
                placeholder="e.g. LinkedIn, Syncfusion Careers"
                value={jobPortal}
                onChange={(e) => setJobPortal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 placeholder:text-slate-500"
                required
              />
              <datalist id="portal-suggestions">
                <option value="LinkedIn" />
                <option value="Company Careers" />
                <option value="Naukri" />
                <option value="Wellfound" />
                <option value="Instahyre" />
                <option value="Hirist" />
                <option value="Indeed" />
                <option value="Employee Referral" />
                <option value="Campus Placement" />
                <option value="Walk-in Drive" />
                <option value="Foundit" />
                <option value="Direct HR Email" />
              </datalist>
            </div>

            {/* Application Date */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                Application Date
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40"
              />
            </div>
          </div>

          {/* Resume Upload & Watch Section */}
          <div className="p-4 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pink-400" />
                <span>Resume Attached & Stored in Database</span>
              </label>
              {resumes.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedResume) {
                      setResumeUsedId('');
                      setRecentlyUploadedResume(null);
                      setIsUploadingResume(true);
                      setUploadFile(null);
                    } else {
                      setIsUploadingResume(!isUploadingResume);
                    }
                  }}
                  className="text-xs text-pink-400 hover:text-pink-300 font-medium transition-colors"
                >
                  {selectedResume
                    ? '+ Upload different resume'
                    : isUploadingResume
                    ? `Pick from saved resumes (${resumes.length})`
                    : '+ Upload new resume'}
                </button>
              )}
            </div>

            {/* When a resume is attached / saved */}
            {selectedResume ? (
              <div className="p-3.5 rounded-xl bg-[#140b25] border border-pink-500/40 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-100 truncate">
                      {selectedResume.resume_name}
                    </div>
                    <div className="text-[11px] text-pink-400 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Saved in Database</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {onViewResume && (
                    <button
                      type="button"
                      onClick={() => onViewResume(selectedResume)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-pink-600/25 hover:scale-[1.02]"
                      title="Watch / Preview this resume"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Watch Resume</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setResumeUsedId('');
                      setRecentlyUploadedResume(null);
                      setIsUploadingResume(true);
                      setUploadFile(null);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-[#241442] hover:bg-[#301b57] text-pink-200 hover:text-white text-xs font-medium border border-purple-500/30 transition-colors"
                    title="Change or upload a different resume"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : isUploadingResume ? (
              /* Ask to Upload Resume */
              <div className="space-y-3">
                {!uploadFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="p-4 rounded-xl border-2 border-dashed border-purple-500/40 hover:border-pink-500/80 bg-[#140b25]/70 hover:bg-[#180d2e]/90 cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 text-center group"
                  >
                    <div className="p-2 rounded-xl bg-pink-500/15 text-pink-400 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-200">
                      Upload Resume for this Application
                    </span>
                    <span className="text-[11px] text-pink-200/70">
                      Click to choose PDF, DOCX, or TXT • Automatically saved to database
                    </span>
                  </div>
                ) : (
                  /* File is chosen -> Save to Database & Watch */
                  <div className="p-3.5 rounded-xl bg-[#140b25] border border-pink-500/40 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-200 font-semibold truncate">
                        <FileText className="w-4 h-4 text-pink-400 flex-shrink-0" />
                        <span className="truncate">{uploadFile.name}</span>
                        <span className="text-[11px] text-slate-400 font-normal flex-shrink-0">
                          ({(uploadFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadFile(null);
                          setUploadResumeName('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-xs text-slate-400 hover:text-rose-400 font-medium px-1.5 py-0.5"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Resume Label (e.g. Kavi_SoftwareEngineer_Resume)"
                        value={uploadResumeName}
                        onChange={(e) => setUploadResumeName(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-[#1c1032] border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleInlineResumeUpload(false)}
                          disabled={uploadingState}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#833ab4] hover:bg-[#9637cf] disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingState ? 'Saving...' : 'Save to Database'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInlineResumeUpload(true)}
                          disabled={uploadingState}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
                          title="Save to database and immediately watch resume"
                        >
                          <Eye className="w-3.5 h-3.5 text-white" />
                          <span>Save & Watch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setUploadFile(file);
                      if (!uploadResumeName) {
                        setUploadResumeName(file.name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              /* Pick from saved resumes */
              <div className="space-y-2">
                <select
                  value={resumeUsedId}
                  onChange={(e) => setResumeUsedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#140b25] border border-purple-500/30 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                >
                  <option value="">-- Select a Saved Resume --</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.resume_name} {Boolean(r.is_active) ? '★ Active' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Reply Status - Type Freely */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Reply Status
              </label>
              <input
                type="text"
                list="reply-status-suggestions"
                placeholder="e.g. No Reply, Replied..."
                value={replyStatus}
                onChange={(e) => setReplyStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 placeholder:text-slate-500"
              />
              <datalist id="reply-status-suggestions">
                <option value="No Reply" />
                <option value="Replied" />
                <option value="Under Review" />
                <option value="Followed Up" />
                <option value="Ghosted" />
              </datalist>
            </div>

            {/* Application Status - Type Freely */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Application Status
              </label>
              <input
                type="text"
                list="app-status-suggestions"
                placeholder="e.g. Applied, In Progress, Interview Scheduled..."
                value={applicationStatus}
                onChange={(e) => setApplicationStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 placeholder:text-slate-500"
              />
              <datalist id="app-status-suggestions">
                <option value="Applied" />
                <option value="In Progress" />
                <option value="Interview Scheduled" />
                <option value="Offer" />
                <option value="Rejected" />
                <option value="Shortlisted" />
                <option value="Online Assessment" />
              </datalist>
            </div>
          </div>

          {/* Salary / Stipend */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#f09433]" />
              Salary Expectation / CTC Range
            </label>
            <input
              type="text"
              placeholder="e.g. ₹12 - 16 LPA or ₹25,000/mo stipend"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 placeholder:text-slate-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Application Notes & Referral Details
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Applied with referral from college senior; completed OA on HackerRank..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-pink-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#201138] hover:bg-[#2c174d] text-slate-300 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-pink-600/25 transition-all hover:scale-[1.02]"
            >
              {submitting ? 'Saving...' : editingApp ? 'Update Application' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
