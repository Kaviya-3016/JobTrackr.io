import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Bookmark,
  Building2,
  Briefcase,
  Link as LinkIcon,
  IndianRupee,
  Image as ImageIcon,
  Upload,
  Trash2,
  Plus,
  FileText,
  ExternalLink,
  Eye
} from 'lucide-react';
import type { WaitlistJob, WaitlistLink } from '../../types';
import { api } from '../../services/api';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<WaitlistJob>) => Promise<void>;
  editingItem?: WaitlistJob | null;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingItem
}) => {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [description, setDescription] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [links, setLinks] = useState<WaitlistLink[]>([]);
  const [salaryExpectation, setSalaryExpectation] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'Wishlist' | 'Applied' | 'Completed'>('Wishlist');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(false);

  // New link draft state
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) {
      setCompanyName(editingItem.company_name || '');
      setRole(editingItem.role || '');
      setJobUrl(editingItem.job_url || '');
      setDescription(editingItem.description || '');
      setScreenshotUrl(editingItem.screenshot_url || '');
      
      let parsedLinks: WaitlistLink[] = [];
      if (typeof editingItem.links === 'string') {
        try {
          parsedLinks = JSON.parse(editingItem.links);
        } catch {
          parsedLinks = [];
        }
      } else if (Array.isArray(editingItem.links)) {
        parsedLinks = editingItem.links;
      }
      setLinks(parsedLinks);

      setSalaryExpectation(editingItem.salary_expectation || '');
      setNotes(editingItem.notes || '');
      setStatus(editingItem.status || 'Wishlist');
    } else {
      setCompanyName('');
      setRole('');
      setJobUrl('');
      setDescription('');
      setScreenshotUrl('');
      setLinks([]);
      setSalaryExpectation('');
      setNotes('');
      setStatus('Wishlist');
    }
    setShowAddLink(false);
    setNewLinkTitle('');
    setNewLinkUrl('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    try {
      setUploadingImage(true);
      const res = await api.uploadWaitlistScreenshot(file);
      setScreenshotUrl(res.file_url);
    } catch (err: any) {
      alert(err.message || 'Failed to upload screenshot');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    const formattedUrl = newLinkUrl.startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`;
    const newLink: WaitlistLink = {
      title: newLinkTitle.trim() || 'Link',
      url: formattedUrl
    };
    setLinks([...links, newLink]);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setShowAddLink(false);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) return;

    try {
      setSubmitting(true);
      await onSubmit({
        company_name: companyName.trim(),
        role: role.trim(),
        job_url: jobUrl.trim() || undefined,
        description: description.trim() || undefined,
        screenshot_url: screenshotUrl || undefined,
        links: links.length > 0 ? links : undefined,
        salary_expectation: salaryExpectation.trim() || undefined,
        notes: notes.trim() || undefined,
        status
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="w-full max-w-xl rounded-2xl bg-[#140b25] border border-pink-500/25 shadow-2xl shadow-purple-950/60 overflow-hidden animate-slide-up my-auto flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-pink-500/20 bg-gradient-to-r from-[#bc1888]/20 via-[#dc2743]/15 to-[#140b25] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white border border-pink-400/30">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {editingItem ? 'Edit Wishlist Target' : 'Add Job to Wishlist'}
                </h3>
                <p className="text-xs text-pink-200/70">Save job posting screenshots, links, and descriptions</p>
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
            {/* Row 1: Company & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-pink-400" />
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Stripe, Uber, Google"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:ring-2 focus:ring-pink-500/40 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-pink-400" />
                  Role Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer - Full Stack"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-white text-xs focus:ring-2 focus:ring-pink-500/40 outline-none"
                  required
                />
              </div>
            </div>

            {/* Row 2: Photos / Screenshots Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                  Photos / Screenshots of Job Posting
                </span>
                <span className="text-[11px] text-pink-200/70 font-normal">PNG, JPG, WebP</span>
              </label>

              {screenshotUrl ? (
                <div className="p-3 rounded-xl bg-[#1c1032]/60 border border-purple-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={screenshotUrl}
                      alt="Job Screenshot"
                      className="w-16 h-12 rounded-lg object-cover border border-purple-500/40 bg-[#120822] cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setPreviewImageModal(true)}
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block truncate max-w-[200px] sm:max-w-xs">
                        {screenshotUrl.split('/').pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewImageModal(true)}
                        className="text-[11px] text-pink-400 hover:text-pink-300 font-medium flex items-center gap-1 mt-0.5"
                      >
                        <Eye className="w-3 h-3" /> View full screenshot
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="px-2.5 py-1 rounded-lg bg-[#241442] hover:bg-[#301b57] text-pink-200 text-xs border border-purple-500/30"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreenshotUrl('')}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20"
                      title="Remove screenshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl border-2 border-dashed border-purple-500/40 hover:border-pink-500/80 bg-[#140b25]/70 hover:bg-[#180d2e]/90 cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 text-center"
                >
                  <div className="p-2 rounded-xl bg-pink-500/15 text-pink-400">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-200">
                    {uploadingImage ? 'Uploading screenshot...' : 'Click to upload job screenshot or flyer'}
                  </span>
                  <span className="text-[11px] text-pink-200/70">
                    Save screenshot of job posting, LinkedIn post, or requirements
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Row 3: Description Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                Description Box (Job Details & Requirements)
              </label>
              <textarea
                rows={4}
                placeholder="Paste full job description, eligibility criteria, tech stack, required qualifications, and responsibilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Row 4: Links Management */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-pink-400" />
                  Primary Job Posting URL
                </span>
              </label>
              <input
                type="url"
                placeholder="https://careers.company.com/job/123..."
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 outline-none"
              />

              {/* Extra Links List */}
              {links.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-pink-300 block uppercase">
                    Additional Useful Links:
                  </span>
                  <div className="space-y-1">
                    {links.map((link, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-[#1c1032]/60 border border-purple-500/30 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate max-w-[85%]">
                          <ExternalLink className="w-3 h-3 text-pink-400 flex-shrink-0" />
                          <span className="font-semibold text-slate-200">{link.title}:</span>
                          <span className="text-slate-400 truncate">{link.url}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(idx)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Extra Link Button / Input */}
              {showAddLink ? (
                <div className="p-3 rounded-xl bg-[#1c1032]/70 border border-purple-500/30 space-y-2 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Title (e.g. Referral Form, LinkedIn Post)"
                      value={newLinkTitle}
                      onChange={(e) => setNewLinkTitle(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#140b25] border border-purple-500/30 text-slate-200 text-xs outline-none"
                    />
                    <input
                      type="url"
                      placeholder="URL (https://...)"
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#140b25] border border-purple-500/30 text-slate-200 text-xs outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddLink(false)}
                      className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-3 py-1 rounded-lg bg-[#833ab4] hover:bg-[#9637cf] text-white text-xs font-semibold"
                    >
                      Save Link
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddLink(true)}
                  className="text-xs text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1 pt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Related Link (Referral, LinkedIn Post)
                </button>
              )}
            </div>

            {/* Row 5: Salary & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-purple-500/20">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#f09433]" />
                  Target CTC / Salary Range
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹18 - 25 LPA"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notes & Application Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apply before Nov 15; ask alumni"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1a0f30]/90 border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 outline-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
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
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-pink-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? 'Saving...' : editingItem ? 'Update Target' : 'Add to Wishlist'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* High-Resolution Screenshot Lightbox Modal */}
      {previewImageModal && screenshotUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewImageModal(false)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImageModal(false)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={screenshotUrl}
              alt="Full Job Posting Screenshot"
              className="max-h-[85vh] max-w-full rounded-2xl border border-slate-700 shadow-2xl object-contain bg-slate-900"
            />
          </div>
        </div>
      )}
    </>
  );
};
