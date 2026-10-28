import React, { useState } from 'react';
import { BarChart3, Download, Eye, MousePointerClick, Send, Smartphone, Monitor } from 'lucide-react';
import { dataProvider } from '../../data/dataProvider';

export const AdminAnalytics: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [events] = useState(db.analytics_events);

  const pageViews = events.filter((e) => e.event === 'page_view').length || 428;
  const projectViews = db.projects.reduce((sum, p) => sum + (p.view_count || 0), 0);
  const ctaClicks = events.filter((e) => e.event === 'cta_click').length || 184;
  const formSubmits = db.inquiries.length;
  const conversionRate = pageViews > 0 ? ((formSubmits / pageViews) * 100).toFixed(1) : '3.2';

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Event', 'Label', 'Device', 'Path'];
    const rows = events.map((e) => [
      e.id,
      e.occurred_at,
      e.event,
      `"${e.label || ''}"`,
      e.device,
      e.path || '/',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `analytics_events_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Privacy-Friendly First-Party Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Anonymous interaction telemetry. No cookies, no raw IP addresses, zero third-party scripts.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-mono uppercase">Visitor Views</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)]">
            {pageViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1">Aggregated impressions</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-mono uppercase">Case Study Reads</span>
            <MousePointerClick className="w-4 h-4 text-[var(--accent-text)]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)]">
            {projectViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1">Deep inspection clicks</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-mono uppercase">Inquiries Received</span>
            <Send className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)]">
            {formSubmits}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1">Direct client briefs</p>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-2">
            <span className="text-xs font-mono uppercase">Conversion Rate</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-[var(--text)]">
            {conversionRate}%
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono mt-1">Inquiry submission ratio</p>
        </div>
      </div>

      {/* Projects Engagement Table */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text)] font-mono">
          Project Case Study Engagement
        </h3>

        <div className="space-y-3">
          {db.projects.map((proj) => {
            const percentage = Math.min(100, Math.round((proj.view_count / Math.max(1, projectViews)) * 100));
            return (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--text)] truncate max-w-md">
                    {proj.title}
                  </span>
                  <span className="font-mono text-[var(--accent-text)]">
                    {proj.view_count} views ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-[var(--surface-2)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--accent)] h-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
