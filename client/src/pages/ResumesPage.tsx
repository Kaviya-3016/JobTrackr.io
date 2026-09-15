import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import type { Resume } from '../types';
import { api } from '../services/api';

interface ResumesPageProps {
  resumes: Resume[];
  onUploadSuccess: () => void;
  onSetActive: (id: string) => Promise<void>;
  onDeleteResume: (id: string) => Promise<void>;
  onViewResume?: (resume: Resume) => void;
}

export const ResumesPage: React.FC<ResumesPageProps> = ({
  resumes,
  onUploadSuccess,
  onSetActive,
  onDeleteResume,
  onViewResume
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!resumeName) {
        setResumeName(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !resumeName) {
      setError('Please choose a file or specify a resume name.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const formData = new FormData();
      if (file) formData.append('resumeFile', file);
      formData.append('resume_name', resumeName || file?.name || 'Resume');

      await api.uploadResume(formData);
      setFile(null);
      setResumeName('');
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-pink-500/25">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Resume Management Hub
          </h2>
          <p className="text-xs text-slate-300/80">
            Upload and store multiple resume versions, designate your active CV, and watch/preview files anytime
          </p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
          <Upload className="w-4 h-4 text-pink-400" />
          Upload & Store Resume in Database
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Supported formats: PDF, DOC, DOCX. The document will be securely stored and viewable anytime in the embedded previewer.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <input
              type="text"
              placeholder="Resume label (e.g. Kavi_Syncfusion_SDE_2026)"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-slate-100 placeholder-slate-400 text-xs focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50 transition-all"
            />
          </div>

          <div className="sm:col-span-5">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-[#833ab4] file:to-[#e1306c] file:text-white hover:file:opacity-90 cursor-pointer"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-pink-500/30 transition-all"
            >
              {uploading ? 'Storing...' : 'Upload & Save'}
            </button>
          </div>
        </form>
      </div>

      {/* Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map((resume) => {
          const isActive = Boolean(resume.is_active);
          return (
            <div
              key={resume.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-md ${
                isActive
                  ? 'bg-[#190d2e]/95 border-pink-500/60 shadow-xl shadow-pink-500/20'
                  : 'bg-[#140b25]/80 border-purple-500/25 hover:border-pink-500/40 hover:bg-[#180e2d]/85'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${isActive ? 'bg-gradient-to-tr from-[#f09433] to-[#dc2743] text-white shadow-md shadow-pink-500/20' : 'bg-[#22133d] text-pink-300'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 text-[10px] font-bold border border-pink-500/35">
                      <CheckCircle2 className="w-3 h-3 text-[#e1306c]" /> Active Resume
                    </span>
                  ) : (
                    <button
                      onClick={() => onSetActive(resume.id)}
                      className="text-[11px] text-slate-300 hover:text-white hover:border-pink-500/40 font-medium px-2.5 py-1 rounded-lg bg-[#22133d] border border-purple-500/30 transition-all"
                    >
                      Set as Active
                    </button>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1 truncate" title={resume.resume_name}>
                  {resume.resume_name}
                </h4>
                <p className="text-[11px] text-slate-400 mb-3">
                  Uploaded {resume.uploaded_date?.split(' ')[0] || 'Recently'}
                </p>
              </div>

              {/* Actions with prominent Watch Resume button */}
              <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs">
                {onViewResume && (
                  <button
                    type="button"
                    onClick={() => onViewResume(resume)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#e1306c] to-[#833ab4] hover:opacity-95 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-pink-500/20 transition-all"
                    title="Watch resume preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Watch Resume</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-pink-300 transition-colors"
                    title="Open in new window"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${resume.resume_name}?`)) {
                        onDeleteResume(resume.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
