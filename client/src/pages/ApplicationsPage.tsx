import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  CalendarCheck,
  Download,
  ExternalLink,
  MapPin,
  Clock,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  FileText,
  Eye
} from 'lucide-react';
import type { JobApplication, Resume } from '../types';

interface ApplicationsPageProps {
  applications: JobApplication[];
  resumes: Resume[];
  onOpenNewApp: () => void;
  onEditApp: (app: JobApplication) => void;
  onDeleteApp: (id: string) => Promise<void>;
  onLogInterviewForApp: (app: JobApplication) => void;
  onStatusChange: (id: string, status: JobApplication['application_status']) => Promise<void>;
  onViewResume?: (resume: Resume) => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  resumes,
  onOpenNewApp,
  onEditApp,
  onDeleteApp,
  onLogInterviewForApp,
  onStatusChange,
  onViewResume
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [portalFilter, setPortalFilter] = useState('All');
  const [replyFilter, setReplyFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  // Filter and sort applications
  const filteredApps = applications
    .filter((app) => {
      const matchSearch =
        searchTerm === '' ||
        app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role_applied.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_portal.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || app.application_status === statusFilter;
      const matchPortal = portalFilter === 'All' || app.job_portal === portalFilter;
      const matchReply = replyFilter === 'All' || app.reply_status === replyFilter;

      return matchSearch && matchStatus && matchPortal && matchReply;
    })
    .sort((a, b) => {
      return sortOrder === 'desc' ? b.s_no - a.s_no : a.s_no - b.s_no;
    });

  const portals = Array.from(new Set(applications.map(a => a.job_portal))).filter(Boolean);

  const exportCSV = () => {
    window.open('/api/export/csv', '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Offer':
        return 'bg-orange-500/15 text-[#fca052] border-orange-500/30';
      case 'Interview Scheduled':
        return 'bg-pink-500/15 text-pink-300 border-pink-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Rejected':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
    }
  };

  const findResumeForApp = (app: JobApplication): Resume | null => {
    if (app.resume_used_id) {
      const found = resumes.find(r => r.id === app.resume_used_id);
      if (found) return found;
    }
    if (app.resume_name) {
      return {
        id: app.resume_used_id || 'sample-id',
        user_id: app.user_id,
        resume_name: app.resume_name,
        file_url: '/uploads/resumes/kavi_sde_resume.pdf',
        ats_score: (app as any).resume_ats_score || 88,
        is_active: 0,
        uploaded_date: app.created_at || ''
      };
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <span>Job Applications Directory</span>
          </h2>
          <p className="text-xs text-pink-200/70">
            {filteredApps.length} of {applications.length} applications shown • S.No auto-assigned per user
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-[#241442] hover:bg-[#301b57] text-pink-200 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenNewApp}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-pink-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#140b25]/80 border border-pink-500/20 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
            <input
              type="text"
              placeholder="Search by company, role, portal, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500 placeholder:text-slate-500"
            />
          </div>

          {/* Portal Filter */}
          <div className="sm:col-span-3">
            <select
              value={portalFilter}
              onChange={(e) => setPortalFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-pink-100 text-xs focus:ring-2 focus:ring-pink-500/40"
            >
              <option value="All">All Job Portals ({portals.length})</option>
              {portals.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Reply Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={replyFilter}
              onChange={(e) => setReplyFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-pink-100 text-xs focus:ring-2 focus:ring-pink-500/40"
            >
              <option value="All">All Reply Statuses</option>
              <option value="Replied">Replied Only</option>
              <option value="No Reply">No Reply</option>
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-purple-500/20 text-xs">
          <span className="text-[11px] text-pink-300 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {['All', 'Applied', 'In Progress', 'Interview Scheduled', 'Offer', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#f09433]/20 via-[#dc2743]/20 to-[#bc1888]/20 text-pink-300 border border-pink-500/40 font-bold'
                  : 'bg-[#1c1032]/60 text-slate-400 hover:text-white border border-purple-500/20'
              }`}
            >
              {st}
            </button>
          ))}

          {/* S.No Sort Switcher */}
          <button
            onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
            className="ml-auto text-xs text-pink-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1c1032]/60 border border-purple-500/20"
          >
            <ArrowUpDown className="w-3 h-3" />
            <span>S.No ({sortOrder.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-2xl bg-[#140b25]/80 border border-pink-500/20 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#1c1032]/60 border-b border-purple-500/20 text-slate-300">
                <th className="py-3 px-4 font-semibold w-16">S.No</th>
                <th className="py-3 px-4 font-semibold">Company</th>
                <th className="py-3 px-4 font-semibold">Role Applied</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Portal</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Resume</th>
                <th className="py-3 px-4 font-semibold">Reply</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-500/15">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => {
                  const attachedResume = findResumeForApp(app);
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-pink-500/5 transition-colors group cursor-pointer"
                      onClick={() => setSelectedApp(app)}
                    >
                      {/* S.No */}
                      <td className="py-3 px-4 font-bold text-slate-400">
                        #{app.s_no}
                      </td>

                      {/* Company */}
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="flex items-center gap-2">
                          <span>{app.company_name}</span>
                          {app.application_status === 'Offer' && (
                            <span className="text-[10px] text-[#fca052] font-normal">🎉</span>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-4 text-slate-300">
                        <div>
                          <span>{app.role_applied}</span>
                          {app.salary_range && (
                            <span className="text-[10px] text-[#f09433] block font-medium">
                              {app.salary_range}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#f09433]" />
                          {app.job_location}
                        </span>
                      </td>

                      {/* Portal */}
                      <td className="py-3 px-4 text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-[#1c1032] text-pink-200/90 border border-purple-500/30 text-[11px] font-medium">
                          {app.job_portal}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-400">
                        {app.application_date}
                      </td>

                      {/* Attached Resume with Watch Action */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        {attachedResume ? (
                          <button
                            type="button"
                            onClick={() => onViewResume && onViewResume(attachedResume)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/30 text-[11px] font-medium transition-all hover:scale-[1.03]"
                            title="Click to watch / view resume"
                          >
                            <Eye className="w-3 h-3 text-pink-400" />
                            <span className="max-w-[85px] truncate">Watch</span>
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Reply Status */}
                      <td className="py-3 px-4">
                        {app.reply_status === 'Replied' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 text-[10px] font-semibold border border-pink-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Replied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1c1032] text-slate-400 text-[10px] border border-purple-500/20">
                            <Clock className="w-3 h-3 text-slate-500" /> No Reply
                          </span>
                        )}
                      </td>

                      {/* Application Status Dropdown */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={app.application_status}
                          onChange={(e) => onStatusChange(app.id, e.target.value as any)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer bg-[#140b25] ${getStatusBadge(
                            app.application_status
                          )}`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onLogInterviewForApp(app)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                            title="Log Interview"
                          >
                            <CalendarCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditApp(app)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
                            title="Edit Application"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete application for ${app.company_name}?`)) {
                                onDeleteApp(app.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Application"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400">
                    No applications match the current search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Detail Drawer / Modal if selected */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#140b25] border border-pink-500/25 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-pink-500/20 pb-3">
              <div>
                <span className="text-xs font-bold text-pink-300/80">Application #{selectedApp.s_no}</span>
                <h3 className="text-base font-bold text-white">{selectedApp.company_name}</h3>
                <p className="text-xs text-pink-400">{selectedApp.role_applied}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#1c1032]/60 border border-purple-500/30">
                <span className="text-slate-400 block text-[11px]">Location</span>
                <span className="font-semibold text-slate-200">{selectedApp.job_location}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1c1032]/60 border border-purple-500/30">
                <span className="text-slate-400 block text-[11px]">Job Portal</span>
                <span className="font-semibold text-slate-200">{selectedApp.job_portal}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1c1032]/60 border border-purple-500/30">
                <span className="text-slate-400 block text-[11px]">Application Date</span>
                <span className="font-semibold text-slate-200">{selectedApp.application_date}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1c1032]/60 border border-purple-500/30">
                <span className="text-slate-400 block text-[11px]">Status</span>
                <span className="font-semibold text-pink-400">{selectedApp.application_status}</span>
              </div>
            </div>

            {/* Attached Resume Info & Watch Action */}
            {selectedApp.resume_name && (
              <div className="p-3.5 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Attached Resume</span>
                  <span className="font-semibold text-white">{selectedApp.resume_name}</span>
                </div>
                {onViewResume && (
                  <button
                    type="button"
                    onClick={() => {
                      const resObj = findResumeForApp(selectedApp);
                      if (resObj) onViewResume(resObj);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Watch Resume</span>
                  </button>
                )}
              </div>
            )}

            {selectedApp.salary_range && (
              <div className="p-3 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 text-xs">
                <span className="text-slate-400 block text-[11px]">Salary / Stipend</span>
                <span className="font-semibold text-[#f09433]">{selectedApp.salary_range}</span>
              </div>
            )}

            {selectedApp.notes && (
              <div className="p-3 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 text-xs">
                <span className="text-slate-400 block text-[11px] mb-1">Notes</span>
                <p className="text-slate-300 leading-relaxed">{selectedApp.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-pink-500/20">
              <button
                onClick={() => {
                  setSelectedApp(null);
                  onLogInterviewForApp(selectedApp);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#dc2743] to-[#833ab4] hover:opacity-95 text-white text-xs font-semibold"
              >
                Log Interview
              </button>
              <button
                onClick={() => {
                  const toEdit = selectedApp;
                  setSelectedApp(null);
                  onEditApp(toEdit);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#241442] hover:bg-[#301b57] text-pink-200 text-xs font-semibold border border-purple-500/30"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
