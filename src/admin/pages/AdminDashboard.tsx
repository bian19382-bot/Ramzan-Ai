import React from 'react';
import {
  Eye,
  FolderKanban,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Clock,
} from 'lucide-react';
import { dataProvider } from '../../data/dataProvider';
import { AdminTab } from '../AdminLayout';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const db = dataProvider.getDatabase();
  const sampleCounts = dataProvider.getSampleCounts();
  const totalSamples = dataProvider.getTotalSampleCount();
  const readiness = dataProvider.getLaunchReadiness();

  const totalViews = db.projects.reduce((acc, curr) => acc + (curr.view_count || 0), 0);
  const publishedProjects = db.projects.filter((p) => p.status === 'published');
  const recentInquiries = db.inquiries.slice(0, 4);
  const recentLogs = db.audit_logs.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Title & Environment Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)] tracking-tight">
            Executive Studio Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Realtime metrics, content lifecycle, and production launch readiness overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('sample-data')}
            className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-2 hover:bg-amber-500/25 transition cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Sample Items: {totalSamples}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] flex items-center gap-1.5 transition"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4 KPI Cards (AD-10) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-3 text-[var(--text-muted)]">
            <span className="text-xs font-mono uppercase tracking-wider">Project Views</span>
            <Eye className="w-4 h-4 text-[var(--accent-text)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)]">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">Telemetry across case studies</p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-3 text-[var(--text-muted)]">
            <span className="text-xs font-mono uppercase tracking-wider">Published Projects</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)]">
            {publishedProjects.length}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">
            {db.projects.length - publishedProjects.length} drafts / scheduled
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-3 text-[var(--text-muted)]">
            <span className="text-xs font-mono uppercase tracking-wider">Client Inquiries</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)]">
            {db.inquiries.length}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">
            {db.inquiries.filter((i) => i.status === 'new').length} unread new inquiries
          </p>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-3 text-[var(--text-muted)]">
            <span className="text-xs font-mono uppercase tracking-wider">Launch Readiness</span>
            <CheckCircle className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)]">
            {readiness.score}%
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono">
            {readiness.isReady ? 'Ready for production!' : 'Pending checklist items'}
          </p>
        </div>
      </div>

      {/* Launch Readiness Checklist (AD-11) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold font-display text-[var(--text)]">
              Production Launch Checklist
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              Before deploying to live custom domains, complete these core milestones to remove sample placeholders.
            </p>
          </div>

          <div className="w-full sm:w-48 bg-[var(--surface-2)] h-2.5 rounded-full overflow-hidden border border-[var(--border)]">
            <div
              className="bg-[var(--accent)] h-full transition-all duration-500"
              style={{ width: `${readiness.score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {readiness.items.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                item.complete
                  ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-400'
                  : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-muted)]'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle
                  className={`w-4 h-4 shrink-0 ${item.complete ? 'text-emerald-400' : 'text-zinc-600'}`}
                />
                <span className={`text-xs sm:text-sm font-medium ${item.complete ? 'text-[var(--text)] line-through opacity-80' : 'text-[var(--text)]'}`}>
                  {item.label}
                </span>
              </div>

              {!item.complete && (
                <button
                  onClick={() => {
                    const tabKey = item.target.replace('/admin/', '') as AdminTab;
                    onNavigateTab(tabKey);
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[var(--accent)]/15 hover:bg-[var(--accent)]/25 text-[var(--accent-text)] transition cursor-pointer shrink-0"
                >
                  Fix ↗
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Recent Inquiries + Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold font-display text-[var(--text)]">
              Recent Client Inquiries
            </h3>
            <button
              onClick={() => onNavigateTab('inbox')}
              className="text-xs font-semibold text-[var(--accent-text)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentInquiries.length > 0 ? (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => onNavigateTab('inbox')}
                  className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text)]">
                        {inq.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {inq.email}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-1">
                      {inq.message}
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${
                      inq.status === 'new'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[var(--surface)] text-[var(--text-muted)]'
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)] py-8 text-center font-mono">
              No inquiries received yet.
            </p>
          )}
        </div>

        {/* Audit Log stream (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold font-display text-[var(--text)] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--accent-text)]" />
              <span>Studio Activity Log</span>
            </h3>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-[var(--accent-text)]">
                    {log.action} • {log.table_name}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {new Date(log.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[var(--text)] text-xs leading-relaxed">{log.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
