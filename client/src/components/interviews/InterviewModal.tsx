import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CalendarCheck,
  MapPin,
  Building2,
  Briefcase,
  Calendar,
  FileText,
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import type { Interview, JobApplication, Resume } from '../../types';
import { api } from '../../services/api';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Interview> & { company_name?: string; role_applied?: string; location?: string }) => Promise<void>;
  applications: JobApplication[];
  resumes: Resume[];
  editingInterview?: Interview | null;
  initialType?: 'interview' | 'walk-in';
  onViewResume?: (resume: Resume) => void;
  onRefreshResumes?: () => Promise<void>;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  applications,
  resumes,
  editingInterview,
  initialType = 'interview',
  onViewResume,
  onRefreshResumes
}) => {
  // Core Fields requested by user
  const [companyName, setCompanyName] = useState('');
  const [roleApplied, setRoleApplied] = useState('');
  const [location, setLocation] = useState('');
  const [interviewDate, setInterviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [interviewStatus, setInterviewStatus] = useState('Scheduled');
  const [interviewType, setInterviewType] = useState('Virtual (Google Meet)');
  const [isWalkIn, setIsWalkIn] = useState(false);
  const [walkInDetails, setWalkInDetails] = useState('');
  const [notes, setNotes] = useState('');

  // Resume Upload & Watch States
  const [resumeUsedId, setResumeUsedId] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadResumeName, setUploadResumeName] = useState('');
  const [uploadingState, setUploadingState] = useState(false);
  const [recentlyUploadedResume, setRecentlyUploadedResume] = useState<Resume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize or reset form state
  useEffect(() => {
    if (editingInterview) {
      const matchedApp = applications.find(a => a.id === editingInterview.job_application_id);
      setCompanyName(editingInterview.company_name || matchedApp?.company_name || '');
      setRoleApplied(editingInterview.role_applied || matchedApp?.role_applied || '');
      setLocation(editingInterview.location || editingInterview.job_location || matchedApp?.job_location || '');
      setInterviewDate(editingInterview.interview_date || new Date().toISOString().split('T')[0]);
      setInterviewStatus(editingInterview.interview_status || 'Scheduled');
      setInterviewType(editingInterview.interview_type || (editingInterview.is_walk_in ? 'In-Person (Walk-in Drive)' : 'Virtual (Google Meet)'));
      setIsWalkIn(Boolean(editingInterview.is_walk_in));
      setWalkInDetails(editingInterview.walk_in_details || '');
      setNotes(editingInterview.notes || '');
      setResumeUsedId(editingInterview.resume_used_id || matchedApp?.resume_used_id || '');
      setIsUploadingResume(false);
      setUploadFile(null);
      setRecentlyUploadedResume(null);
    } else {
      const isWalkInMode = initialType === 'walk-in';
      setCompanyName('');
      setRoleApplied('');
      setLocation('');
      setInterviewDate(new Date().toISOString().split('T')[0]);
      setInterviewStatus('Scheduled');
      setInterviewType(isWalkInMode ? 'In-Person (Walk-in Drive)' : 'Virtual (Google Meet)');
      setIsWalkIn(isWalkInMode);
      setWalkInDetails('');
      setNotes('');

      // Auto pick active resume if available
      const activeRes = resumes.find(r => Boolean(r.is_active)) || resumes[0];
      setResumeUsedId(activeRes ? activeRes.id : '');
      setIsUploadingResume(false);
      setUploadFile(null);
      setRecentlyUploadedResume(null);
    }
    setError('');
  }, [editingInterview, isOpen, initialType, applications, resumes]);

  if (!isOpen) return null;

  // Find currently selected resume object
  const selectedResume =
    recentlyUploadedResume ||
    resumes.find(r => r.id === resumeUsedId) ||
    (editingInterview?.resume_name
      ? {
          id: editingInterview.resume_used_id || 'attached',
          user_id: '',
          resume_name: editingInterview.resume_name,
          file_url: editingInterview.resume_file_url || '',
          is_active: 1,
          uploaded_date: editingInterview.interview_date
        }
      : null);

  // Handle uploading a resume inline and immediately saving to database
  const handleInlineResumeUpload = async (andWatch: boolean = false) => {
    if (!uploadFile) return;
    try {
      setUploadingState(true);
      setError('');
      const formData = new FormData();
      formData.append('resume', uploadFile);
      const customName = uploadResumeName.trim() || uploadFile.name.replace(/\.[^/.]+$/, '');
      formData.append('resume_name', customName);

      const res = await api.uploadResume(formData);
      if (res.resume) {
        setResumeUsedId(res.resume.id);
        setRecentlyUploadedResume(res.resume);
        setUploadFile(null);
        setUploadResumeName('');
        setIsUploadingResume(false);
        if (onRefreshResumes) {
          await onRefreshResumes();
        }
        if (andWatch && onViewResume) {
          onViewResume(res.resume);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume to database');
    } finally {
      setUploadingState(false);
    }
  };

  const handleCompanyChange = (val: string) => {
    setCompanyName(val);
    // If val matches an existing application, autofill role and location if they are empty
    const matched = applications.find(a => a.company_name.toLowerCase() === val.trim().toLowerCase());
    if (matched) {
      if (!roleApplied) setRoleApplied(matched.role_applied);
      if (!location) setLocation(matched.job_location);
      if (!resumeUsedId && matched.resume_used_id) setResumeUsedId(matched.resume_used_id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError('Please enter the Company Name');
      return;
    }
    if (!roleApplied.trim()) {
      setError('Please enter the Job Role');
      return;
    }
    if (!interviewDate) {
      setError('Please choose the Interviewed Day');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await onSubmit({
        company_name: companyName.trim(),
        role_applied: roleApplied.trim(),
        location: location.trim(),
        job_location: location.trim(),
        interview_date: interviewDate,
        interview_status: interviewStatus.trim() || 'Scheduled',
        interview_type: interviewType.trim() || (isWalkIn ? 'In-Person (Walk-in Drive)' : 'Virtual'),
        is_walk_in: isWalkIn,
        walk_in_details: isWalkIn ? walkInDetails.trim() : undefined,
        resume_used_id: resumeUsedId || undefined,
        notes: notes.trim() || undefined
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save interview');
    } finally {
      setSubmitting(false);
    }
  };

  const isWalkInMode = initialType === 'walk-in' || isWalkIn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-2xl bg-[#140b25] border border-pink-500/25 shadow-2xl shadow-purple-950/60 overflow-hidden animate-slide-up flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b border-pink-500/20 ${
          isWalkInMode ? 'bg-gradient-to-r from-[#f09433]/20 via-[#dc2743]/15 to-[#140b25]' : 'bg-gradient-to-r from-[#bc1888]/20 via-[#dc2743]/15 to-[#140b25]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              isWalkInMode
                ? 'bg-gradient-to-tr from-[#f09433] to-[#dc2743] text-white border-orange-400/30'
                : 'bg-gradient-to-tr from-[#dc2743] to-[#833ab4] text-white border-pink-400/30'
            }`}>
              {isWalkInMode ? <MapPin className="w-5 h-5" /> : <CalendarCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {editingInterview
                    ? 'Update Interview / Walk-in Log'
                    : isWalkInMode
                    ? 'Log Walk-in Drive'
                    : 'Log Interview'}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isWalkInMode
                    ? 'bg-gradient-to-r from-[#f09433]/20 to-[#dc2743]/20 text-[#fca052] border-orange-500/30'
                    : 'bg-gradient-to-r from-[#dc2743]/20 to-[#bc1888]/20 text-pink-300 border-pink-500/30'
                }`}>
                  {isWalkInMode ? 'Walk-in / In-Person' : 'Scheduled Interview'}
                </span>
              </div>
              <p className="text-xs text-pink-200/70">
                {isWalkInMode
                  ? 'Record company, job role, venue address, reporting day, and resume'
                  : 'Record company, role, interview day, scheduled status, mode, and resume'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Company Name & Job Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-pink-400" />
                Company Name *
              </label>
              <input
                type="text"
                list="company-list-suggestions"
                placeholder="e.g. Syncfusion, Zoho, Google, TCS"
                value={companyName}
                onChange={(e) => handleCompanyChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder:text-slate-500"
                required
              />
              <datalist id="company-list-suggestions">
                {Array.from(new Set(applications.map(a => a.company_name))).map(name => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>

            {/* Job Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-pink-400" />
                Job Role *
              </label>
              <input
                type="text"
                list="role-list-suggestions"
                placeholder="e.g. Frontend Developer, React Engineer"
                value={roleApplied}
                onChange={(e) => setRoleApplied(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder:text-slate-500"
                required
              />
              <datalist id="role-list-suggestions">
                {Array.from(new Set(applications.map(a => a.role_applied))).concat([
                  'Software Engineer',
                  'Frontend Developer',
                  'Backend Developer',
                  'Full Stack Engineer',
                  'Associate Software Engineer',
                  'QA / Automation Engineer',
                  'DevOps Engineer'
                ]).map(r => (
                  <option key={r} value={r} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Row 2: Location & Interviewed Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f09433]" />
                Location
              </label>
              <input
                type="text"
                list="location-list-suggestions"
                placeholder="e.g. Chennai, Bangalore, DLF IT Park, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder:text-slate-500"
              />
              <datalist id="location-list-suggestions">
                {Array.from(new Set(applications.map(a => a.job_location))).concat([
                  'Chennai',
                  'Bangalore',
                  'Hyderabad',
                  'Pune',
                  'Coimbatore',
                  'Remote',
                  'Hybrid'
                ]).map(l => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>

            {/* Interviewed Day */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                Interviewed Day *
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500"
                required
              />
            </div>
          </div>

          {/* Row 3: Scheduled / Rescheduled Status & In-Person or Virtual Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Scheduled / Rescheduled Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-pink-400" />
                Scheduled / Rescheduled Status
              </label>
              <input
                type="text"
                list="interview-status-list"
                placeholder="e.g. Scheduled, Rescheduled, Attended..."
                value={interviewStatus}
                onChange={(e) => setInterviewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder:text-slate-500"
              />
              <datalist id="interview-status-list">
                <option value="Scheduled" />
                <option value="Rescheduled" />
                <option value="Attended" />
                <option value="Offer Received 🎉" />
                <option value="HR Discussion" />
                <option value="Rejected" />
              </datalist>
            </div>

            {/* In-Person or Virtual Interview */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                In-Person or Virtual Interview
              </label>
              <input
                type="text"
                list="interview-mode-list"
                placeholder="e.g. Virtual (Google Meet), In-Person (Walk-in Drive)"
                value={interviewType}
                onChange={(e) => {
                  const val = e.target.value;
                  setInterviewType(val);
                  if (
                    val.toLowerCase().includes('walk-in') ||
                    val.toLowerCase().includes('person') ||
                    val.toLowerCase().includes('onsite') ||
                    val.toLowerCase().includes('campus')
                  ) {
                    setIsWalkIn(true);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder:text-slate-500"
              />
              <datalist id="interview-mode-list">
                <option value="Virtual (Google Meet)" />
                <option value="Virtual (Zoom / Teams)" />
                <option value="In-Person (Walk-in Drive)" />
                <option value="In-Person (Office / Onsite)" />
                <option value="In-Person (Campus Placement)" />
                <option value="Phone Screening" />
                <option value="Take-Home Project Assessment" />
              </datalist>
            </div>
          </div>

          {/* Walk-in Venue & POC Section */}
          <div className="p-4 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWalkIn}
                  onChange={(e) => setIsWalkIn(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500/40 bg-[#120822] border-purple-500/40 cursor-pointer"
                />
                <MapPin className="w-4 h-4 text-[#f09433]" />
                <span>Walk-in / In-Person Interview Details</span>
              </label>
              {isWalkIn && (
                <span className="text-[10px] font-semibold text-orange-300 bg-[#f09433]/15 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Venue Enabled
                </span>
              )}
            </div>

            {isWalkIn && (
              <div className="space-y-2 pt-1 border-t border-purple-500/20">
                <label className="block text-[11px] text-pink-200/80 font-medium">
                  Walk-in Venue Address, Reporting Person (POC HR), & Required Documents:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. DLF IT Park, Block 3, 4th Floor, Chennai. POC HR: Priya Sharma (Phone: +91 98400xxxxx). Bring 2 printed resume copies, Govt photo ID, and academic certificates..."
                  value={walkInDetails}
                  onChange={(e) => setWalkInDetails(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#140b25] border border-purple-500/30 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder:text-slate-500 resize-none"
                />
              </div>
            )}
          </div>

          {/* Resume Upload & Watch Section */}
          <div className="p-4 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pink-400" />
                <span>Resume for this Interview (Stored in Database)</span>
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

            {/* When a resume is attached */}
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
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-pink-600/25 hover:scale-[1.02]"
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
              /* Upload Area */
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
                      Upload Resume for this Interview / Walk-in
                    </span>
                    <span className="text-[11px] text-pink-200/70">
                      Click to choose PDF, DOCX, or TXT • Automatically saved to database
                    </span>
                  </div>
                ) : (
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
                        placeholder="Resume Label (e.g. My_Frontend_Resume)"
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
                    const f = e.target.files?.[0];
                    if (f) {
                      setUploadFile(f);
                      setUploadResumeName(f.name.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              /* Pick from existing saved resumes */
              <div className="space-y-2">
                <select
                  value={resumeUsedId}
                  onChange={(e) => setResumeUsedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#140b25] border border-purple-500/30 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40"
                >
                  <option value="">-- No Resume Selected --</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.resume_name} {Boolean(r.is_active) ? '★ (Active)' : ''}
                    </option>
                  ))}
                </select>
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadingResume(true);
                      setUploadFile(null);
                    }}
                    className="text-xs text-pink-400 hover:text-pink-300 font-medium"
                  >
                    + Upload New Resume File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preparation / Post-Interview Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Preparation / Interview Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Questions asked on JavaScript closures, promises, and system architecture..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:outline-none focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
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
              className={`px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-lg transition-all hover:scale-[1.02] ${
                isWalkInMode
                  ? 'bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-95 shadow-orange-600/25'
                  : 'bg-gradient-to-r from-[#dc2743] via-[#cc2366] to-[#833ab4] hover:opacity-95 shadow-pink-600/25'
              }`}
            >
              {submitting
                ? 'Saving...'
                : editingInterview
                ? 'Update Interview'
                : isWalkInMode
                ? 'Save Walk-in Log'
                : 'Save Interview Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
