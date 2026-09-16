import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, Maximize2, Minimize2 } from 'lucide-react';
import type { Resume } from '../../types';

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume | null;
}

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  isOpen,
  onClose,
  resume
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'parsed'>('preview');

  if (!isOpen || !resume) return null;

  const fileUrl = resume.file_url.startsWith('http') 
    ? resume.file_url 
    : `${window.location.origin}${resume.file_url}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full rounded-2xl bg-[#140b25] border border-pink-500/25 shadow-2xl shadow-purple-950/60 overflow-hidden flex flex-col transition-all duration-300 ${
          isMaximized ? 'h-[96vh] max-w-[96vw]' : 'h-[85vh] max-w-4xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-pink-500/20 bg-gradient-to-r from-[#bc1888]/20 via-[#dc2743]/15 to-[#140b25] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white border border-pink-400/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                  {resume.resume_name}
                </h3>
                {Boolean(resume.is_active) && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-bold">
                    Active CV
                  </span>
                )}
              </div>
              <p className="text-[11px] text-pink-200/70">
                Uploaded {resume.uploaded_date?.split(' ')[0] || 'Recently'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-[#1c1032] border border-purple-500/30 text-xs">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PDF View
              </button>
              <button
                onClick={() => setViewMode('parsed')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  viewMode === 'parsed'
                    ? 'bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Details & Skills
              </button>
            </div>

            {/* Open in New Tab */}
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-[#241442] text-slate-300 hover:text-white hover:bg-[#301b57] transition-colors"
              title="Open full file in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Download Button */}
            <a
              href={fileUrl}
              download={resume.resume_name}
              className="p-2 rounded-lg bg-[#241442] text-slate-300 hover:text-white hover:bg-[#301b57] transition-colors"
              title="Download Resume file"
            >
              <Download className="w-4 h-4" />
            </a>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2 rounded-lg bg-[#241442] text-slate-300 hover:text-white hover:bg-[#301b57] transition-colors hidden sm:block"
              title={isMaximized ? 'Restore window' : 'Maximize window'}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Viewer */}
        <div className="flex-1 bg-[#0d0618] p-3 sm:p-4 overflow-hidden flex flex-col">
          {viewMode === 'preview' ? (
            <div className="w-full h-full rounded-xl overflow-hidden border border-purple-500/30 bg-[#140b25] relative flex flex-col">
              <iframe
                src={fileUrl}
                title={resume.resume_name}
                className="w-full h-full rounded-xl border-0 bg-white"
              />
              <div className="p-2 bg-[#140b25] border-t border-purple-500/20 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Rendering document preview: <strong>{resume.resume_name}</strong></span>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-pink-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Trouble viewing? Open in browser window</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto p-6 rounded-xl bg-[#140b25]/90 border border-purple-500/30 space-y-5 text-slate-200">
              <div className="border-b border-purple-500/20 pb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white">KAVI</h4>
                  <p className="text-xs text-pink-400 font-medium">
                    Software Developer • B.E. ECE 2026 Batch
                  </p>
                  <p className="text-xs text-slate-400">
                    kaviyamurugan3016@gmail.com • +91-7418082136 • github.com/Kaviya-3016
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold">
                    {resume.is_active ? 'Active CV' : 'Version'}
                  </span>
                  <span className="text-[10px] text-pink-300/60 block mt-1">{resume.resume_name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  Profile Summary
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  2026 graduate in Electronics and Communication Engineering with an 8.1 CGPA. Full-stack software developer focusing on building high-performance web applications, type-safe full-stack services, and modern user experiences using React, TypeScript, Node.js, and relational database systems.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  Technical Core Skills
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'JavaScript (ES6+)', 'TypeScript', 'React 18', 'Node.js', 'Express.js',
                    'PostgreSQL', 'SQLite', 'Tailwind CSS', 'Git & GitHub', 'REST APIs',
                    'WebSockets', 'Data Structures & Algorithms', 'C/C++', 'Object-Oriented Design'
                  ].map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#1c1032] text-slate-200 border border-purple-500/30 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-pink-400 uppercase tracking-wider">
                  Technical Project & Engineering
                </h5>
                <div className="p-3.5 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 space-y-1 text-xs">
                  <div className="flex justify-between font-bold text-slate-100">
                    <span>Full-Stack Web Platform</span>
                    <span className="text-pink-300/80">Featured Project</span>
                  </div>
                  <span className="text-slate-400 block">Interactive Web Architecture</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 pt-1">
                    <li>Engineered responsive full-stack features using React 18 & TypeScript.</li>
                    <li>Integrated real-time WebSocket state management for concurrent user sessions.</li>
                    <li>Designed normalized database queries with low latency responses.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
