import React, { useState } from 'react';
import {
  Database,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { dataProvider } from '../../data/dataProvider';

export const AdminSampleData: React.FC = () => {
  const [counts, setCounts] = useState(dataProvider.getSampleCounts());
  const [totalCount, setTotalCount] = useState(dataProvider.getTotalSampleCount());
  const [confirmInput, setConfirmInput] = useState('');
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [undoToast, setUndoToast] = useState(false);

  const refreshCounts = () => {
    setCounts(dataProvider.getSampleCounts());
    setTotalCount(dataProvider.getTotalSampleCount());
  };

  const handlePurgeAll = () => {
    if (confirmInput !== 'DELETE SAMPLE') return;
    dataProvider.purgeSampleData();
    refreshCounts();
    setShowPurgeModal(false);
    setConfirmInput('');
    setUndoToast(true);
    setTimeout(() => setUndoToast(false), 8000);
  };

  const handleResetSampleData = () => {
    if (confirm('Reset entire database back to default bundled sample datasets? This will overwrite existing demo edits.')) {
      dataProvider.resetToSampleData();
      refreshCounts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Sample Data Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Manage bundled seed datasets, track placeholder content, or purge all sample items before going live.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSampleData}
            className="px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] transition flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed</span>
          </button>

          <button
            onClick={() => setShowPurgeModal(true)}
            disabled={totalCount === 0}
            className="px-5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-semibold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge All Sample Data</span>
          </button>
        </div>
      </div>

      {undoToast && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>All sample rows purged successfully. Launch readiness checklist updated.</span>
          </div>
          <button
            onClick={handleResetSampleData}
            className="underline font-bold hover:text-white cursor-pointer ml-4"
          >
            Undo
          </button>
        </div>
      )}

      {/* Summary Banner */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-display font-bold text-xl">
            {totalCount}
          </div>
          <div>
            <h3 className="text-base font-bold font-display text-[var(--text)]">
              {totalCount > 0 ? `${totalCount} Sample Items Active` : 'Zero Sample Items Remaining!'}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {totalCount > 0
                ? 'Sample records carry is_sample = true and are flagged with an amber badge.'
                : 'Your database contains only verified production content. Ready for custom domain launch!'}
            </p>
          </div>
        </div>

        {totalCount === 0 && (
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
            100% Production Ready
          </span>
        )}
      </div>

      {/* Breakdown by Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(counts).map(([moduleKey, count]) => (
          <div
            key={moduleKey}
            className="p-5 rounded-xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[var(--text-muted)]">
                {moduleKey.replace('_', ' ')}
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  count > 0 ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
                }`}
              >
                {count} sample
              </span>
            </div>
            <div className="text-2xl font-bold font-display text-[var(--text)]">
              {count}
            </div>
          </div>
        ))}
      </div>

      {/* Purge Modal Dialog (AD-30 / Backend Schema §18) */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPurgeModal(false)} />

          <div className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-display text-[var(--text)]">
                Purge All Sample Data?
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                This will delete all {totalCount} sample items across projects, skills, services, testimonials, and FAQs. Real content entered by you will NOT be deleted.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Type <span className="text-red-400 font-bold">DELETE SAMPLE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="DELETE SAMPLE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-red-400 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPurgeModal(false);
                  setConfirmInput('');
                }}
                className="px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--text)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmInput !== 'DELETE SAMPLE'}
                onClick={handlePurgeAll}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-semibold shadow-md transition cursor-pointer disabled:opacity-40"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
