import React, { useState } from 'react';
import {
  Bookmark,
  Plus,
  Building2,
  ExternalLink,
  ArrowRight,
  Trash2,
  Edit2,
  CheckCircle2,
  IndianRupee,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  X,
  Link as LinkIcon
} from 'lucide-react';
import type { WaitlistJob, WaitlistLink } from '../types';

interface WaitlistPageProps {
  waitlist: WaitlistJob[];
  onOpenNewWaitlist: () => void;
  onEditWaitlist: (item: WaitlistJob) => void;
  onDeleteWaitlist: (id: string) => Promise<void>;
  onConvertToApp: (id: string) => Promise<void>;
}

export const WaitlistPage: React.FC<WaitlistPageProps> = ({
  waitlist,
  onOpenNewWaitlist,
  onEditWaitlist,
  onDeleteWaitlist,
  onConvertToApp
}) => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});
  const [activeScreenshotModal, setActiveScreenshotModal] = useState<{ url: string; title: string } | null>(null);

  const filtered = waitlist.filter((item) => {
    return filterStatus === 'All' || item.status === filterStatus;
  });

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConvert = async (id: string) => {
    try {
      setConvertingId(id);
      await onConvertToApp(id);
    } finally {
      setConvertingId(null);
    }
  };

  const parseLinks = (linksData?: string | WaitlistLink[]): WaitlistLink[] => {
    if (!linksData) return [];
    if (Array.isArray(linksData)) return linksData;
    try {
      const parsed = JSON.parse(linksData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-pink-500/25">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Wishlist & "Apply Later" Queue
            </h2>
            <p className="text-xs text-slate-300/80">
              Save job postings with screenshots, multiple application links, and detailed job descriptions
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNewWaitlist}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-pink-500/25 flex items-center gap-1.5 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Job</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-500/20 pb-3 text-xs">
        {['All', 'Wishlist', 'Applied', 'Completed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              filterStatus === st
                ? 'bg-gradient-to-r from-[#e1306c] to-[#833ab4] text-white font-bold shadow-md shadow-pink-500/25'
                : 'bg-[#180e2d]/80 text-slate-300 hover:text-white border border-purple-500/25'
            }`}
          >
            {st} ({waitlist.filter(w => st === 'All' || w.status === st).length})
          </button>
        ))}
      </div>

      {/* Wishlist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length > 0 ? (
          filtered.map((item) => {
            const extraLinks = parseLinks(item.links);
            const isDescExpanded = Boolean(expandedDescriptions[item.id]);

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#140b25]/85 border border-pink-500/20 hover:border-pink-500/40 hover:bg-[#180e2f]/90 transition-all flex flex-col justify-between space-y-4 shadow-xl backdrop-blur-md"
              >
                <div className="space-y-3">
                  {/* Top: Icon, Title & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#22123d] text-pink-300 border border-purple-500/30">
                        <Building2 className="w-5 h-5 text-[#e1306c]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white leading-snug">{item.company_name}</h3>
                        <p className="text-xs text-pink-200/80 font-medium">{item.role}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                        item.status === 'Applied'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/35'
                          : item.status === 'Completed'
                          ? 'bg-pink-500/20 text-pink-300 border-pink-500/35'
                          : 'bg-amber-500/20 text-[#f09433] border-amber-500/35'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Screenshot / Photo Preview */}
                  {item.screenshot_url && (
                    <div
                      className="group relative rounded-xl overflow-hidden border border-purple-500/30 bg-[#0c0617] cursor-pointer aspect-video flex items-center justify-center transition-all hover:border-pink-500/60"
                      onClick={() =>
                        setActiveScreenshotModal({
                          url: item.screenshot_url!,
                          title: `${item.company_name} - ${item.role}`
                        })
                      }
                      title="Click to view full screenshot"
                    >
                      <img
                        src={item.screenshot_url}
                        alt={`${item.company_name} Screenshot`}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-[#0a0515]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-semibold backdrop-blur-[2px]">
                        <ImageIcon className="w-4 h-4 text-[#e1306c]" />
                        <span>View Screenshot</span>
                      </div>
                    </div>
                  )}

                  {/* Salary Expectation */}
                  {item.salary_expectation && (
                    <div className="flex items-center gap-1.5 text-xs text-[#f09433] font-semibold bg-[#f09433]/15 px-2.5 py-1 rounded-lg border border-[#f09433]/30 w-fit">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>{item.salary_expectation}</span>
                    </div>
                  )}

                  {/* Description Box Display */}
                  {item.description && (
                    <div className="p-3 rounded-xl bg-[#1c1032]/70 border border-purple-500/30 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-300 font-semibold">
                        <span className="flex items-center gap-1.5 text-[11px] text-pink-300">
                          <FileText className="w-3.5 h-3.5 text-[#e1306c]" /> Job Description
                        </span>
                        {item.description.length > 140 && (
                          <button
                            onClick={() => toggleDescription(item.id)}
                            className="text-[11px] text-pink-300/80 hover:text-white flex items-center gap-0.5 transition-colors"
                          >
                            {isDescExpanded ? 'Collapse' : 'Read more'}
                            {isDescExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                      <p
                        className={`text-slate-300 leading-relaxed ${
                          !isDescExpanded && item.description.length > 140 ? 'line-clamp-3' : ''
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* Notes / Deadline */}
                  {item.notes && (
                    <p className="text-xs text-slate-300/90 bg-[#1c1032]/50 p-2.5 rounded-xl border border-purple-500/20 leading-relaxed">
                      💡 {item.notes}
                    </p>
                  )}

                  {/* Links List */}
                  {(item.job_url || extraLinks.length > 0) && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold text-pink-300/80 uppercase tracking-wider block">
                        Direct Application & Info Links:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.job_url && (
                          <a
                            href={item.job_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#833ab4]/30 to-[#e1306c]/30 hover:opacity-95 text-pink-200 border border-pink-500/40 text-xs font-medium transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-[#f09433]" />
                            <span>Primary Job Link</span>
                          </a>
                        )}

                        {extraLinks.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#22123d] hover:bg-[#2b174d] text-slate-200 border border-purple-500/30 text-xs font-medium transition-colors"
                          >
                            <LinkIcon className="w-3 h-3 text-[#e1306c]" />
                            <span className="truncate max-w-[130px]">{link.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditWaitlist(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-pink-300 hover:bg-[#22123d] transition-colors"
                      title="Edit Job Details, Links, or Photos"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove ${item.company_name} from wishlist?`)) {
                          onDeleteWaitlist(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.status === 'Wishlist' && (
                    <button
                      onClick={() => handleConvert(item.id)}
                      disabled={convertingId === item.id}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>{convertingId === item.id ? 'Converting...' : 'Apply Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 p-12 text-center rounded-2xl bg-white dark:bg-[#140b25]/60 border border-pink-200 dark:border-purple-500/20 text-slate-600 dark:text-slate-400 text-xs shadow-md shadow-pink-500/5 dark:shadow-none">
            No jobs in this wishlist category.
          </div>
        )}
      </div>

      {/* Global Screenshot Lightbox Preview Modal */}
      {activeScreenshotModal && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[#0a0515]/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveScreenshotModal(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <h3 className="text-sm font-bold truncate max-w-md">
                📸 {activeScreenshotModal.title}
              </h3>
              <button
                onClick={() => setActiveScreenshotModal(null)}
                className="p-1.5 rounded-full bg-[#22123d] text-slate-300 hover:text-white hover:bg-[#2d1850] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={activeScreenshotModal.url}
              alt={activeScreenshotModal.title}
              className="max-h-[82vh] max-w-full rounded-2xl border border-pink-500/30 shadow-2xl object-contain bg-[#120822]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
