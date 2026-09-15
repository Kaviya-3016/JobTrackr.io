import React, { useState } from 'react';
import { Download, FileText, Calendar, Filter, CheckCircle2, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { User, JobApplication } from '../types';

interface ExportPageProps {
  user: User | null;
  applications: JobApplication[];
}

export const ExportPage: React.FC<ExportPageProps> = ({ user, applications }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Filter applications by date range and status
  const getFilteredApps = () => {
    return applications.filter((app) => {
      const matchFrom = !fromDate || app.application_date >= fromDate;
      const matchTo = !toDate || app.application_date <= toDate;
      const matchStatus = statusFilter === 'All' || app.application_status === statusFilter;
      return matchFrom && matchTo && matchStatus;
    });
  };

  const handleExportCSV = () => {
    const apps = getFilteredApps();
    const headers = ['S.No', 'Company Name', 'Role Applied', 'Location', 'Job Portal', 'Date', 'Reply Status', 'Application Status', 'Salary / CTC', 'Notes'];
    const rows = apps.map((a) => [
      a.s_no,
      `"${a.company_name.replace(/"/g, '""')}"`,
      `"${a.role_applied.replace(/"/g, '""')}"`,
      `"${a.job_location.replace(/"/g, '""')}"`,
      `"${a.job_portal.replace(/"/g, '""')}"`,
      a.application_date,
      `"${a.reply_status}"`,
      `"${a.application_status}"`,
      `"${(a.salary_range || '').replace(/"/g, '""')}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kavi_Job_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess('CSV export generated successfully!');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleExportPDF = () => {
    try {
      setGeneratingPDF(true);
      const apps = getFilteredApps();
      const doc = new jsPDF('landscape');

      // Colors
      const primaryMagenta = [225, 48, 108];
      const darkPlum = [22, 10, 44];

      // Document Header
      doc.setFillColor(darkPlum[0], darkPlum[1], darkPlum[2]);
      doc.rect(0, 0, 297, 36, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Job Application Tracking Report', 14, 15);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(244, 219, 235);
      doc.text(
        `Candidate: ${user?.name || 'Kavi'} • Email: ${user?.email || 'kaviyamurugan3016@gmail.com'} • Phone: ${user?.phone || '+91-7418082136'}`,
        14,
        23
      );
      doc.text(
        `Background: 2026 ECE Graduate (8.1 CGPA) | Full-Stack Software Developer`,
        14,
        29
      );

      doc.setFontSize(8);
      doc.setTextColor(225, 175, 210);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, 240, 15);

      // KPI Summary Row
      const total = apps.length;
      const replied = apps.filter(a => a.reply_status === 'Replied').length;
      const scheduled = apps.filter(a => a.application_status === 'Interview Scheduled').length;
      const offers = apps.filter(a => a.application_status === 'Offer').length;
      const replyRate = total > 0 ? ((replied / total) * 100).toFixed(1) : '0';

      doc.setDrawColor(240, 148, 51);
      doc.setFillColor(253, 245, 248);
      doc.roundedRect(14, 42, 269, 16, 2, 2, 'FD');

      doc.setFontSize(9);
      doc.setTextColor(51, 25, 75);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Applications: ${total}`, 20, 52);
      doc.text(`Replies: ${replied} (${replyRate}%)`, 80, 52);
      doc.text(`Interviews Scheduled: ${scheduled}`, 150, 52);
      doc.text(`Offers: ${offers}`, 220, 52);

      // Table Content
      const tableData = apps.map((app) => [
        `#${app.s_no}`,
        app.company_name,
        app.role_applied,
        app.job_location,
        app.job_portal,
        app.application_date,
        app.reply_status,
        app.application_status,
        app.salary_range || '-'
      ]);

      autoTable(doc, {
        head: [['S.No', 'Company', 'Role Applied', 'Location', 'Portal', 'Date', 'Reply', 'Status', 'CTC / Stipend']],
        body: tableData,
        startY: 64,
        styles: {
          fontSize: 8,
          cellPadding: 2.5
        },
        headStyles: {
          fillColor: [225, 48, 108],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [253, 244, 249]
        }
      });

      doc.save(`Kavi_Job_Tracker_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      setDownloadSuccess('PDF report generated successfully!');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const filteredCount = getFilteredApps().length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-pink-500/25">
          <Download className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Export Center (CSV & Formatted PDF)
          </h2>
          <p className="text-xs text-slate-300/80">
            Generate comprehensive reports with custom date ranges, response KPIs, and application summaries
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-pink-500/15 border border-pink-500/35 text-pink-200 text-xs flex items-center gap-2 shadow-lg shadow-pink-500/15">
          <CheckCircle2 className="w-4 h-4 text-[#e1306c] flex-shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Date Range & Status Filters */}
      <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 shadow-xl backdrop-blur-md space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#e1306c]" />
          Filter Data for Export
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-pink-200/90 mb-1">
              From Application Date:
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-200/90 mb-1">
              To Application Date:
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-pink-200/90 mb-1">
              Application Status Filter:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1c1032]/80 border border-purple-500/30 text-slate-100 text-xs focus:ring-2 focus:ring-pink-500/40 focus:border-pink-500/50"
            >
              <option value="All">All Statuses ({applications.length})</option>
              <option value="Applied">Applied</option>
              <option value="In Progress">In Progress</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="pt-2 text-xs text-slate-400">
          Selected: <strong className="text-[#f09433] font-bold">{filteredCount} applications</strong> ready for export.
        </div>
      </div>

      {/* Export Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* PDF Export Card */}
        <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#dc2743] to-[#bc1888] text-white shadow-lg shadow-pink-500/25 w-fit">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Executive PDF Report</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Downloads a landscape PDF report with Kavi's profile header, response rate accuracy metrics, interview conversions, and structured tables with sequential S.No.
            </p>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={generatingPDF}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#dc2743] via-[#e1306c] to-[#833ab4] hover:opacity-95 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{generatingPDF ? 'Generating Document...' : 'Download Formatted PDF'}</span>
          </button>
        </div>

        {/* CSV Export Card */}
        <div className="p-6 rounded-2xl bg-[#140b25]/85 border border-pink-500/25 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#f09433] to-[#e6683c] text-white shadow-lg shadow-orange-500/25 w-fit">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Spreadsheet Data (CSV)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exports a clean, spreadsheet-compatible CSV file with all company names, roles, portal sources, reply statuses, CTC numbers, and application dates.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Spreadsheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
