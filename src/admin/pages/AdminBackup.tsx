import React, { useState } from 'react';
import { Download, Upload, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';
import { dataProvider } from '../../data/dataProvider';
import { safeStorage, STORAGE_KEYS } from '../../lib/storage';

export const AdminBackup: React.FC = () => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importDiff, setImportDiff] = useState<any | null>(null);

  const handleExportJson = () => {
    const db = dataProvider.getDatabase();
    const exportPayload = {
      schema: 1,
      exportedAt: new Date().toISOString(),
      database: db,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `portfolio_snapshot_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.database || !parsed.schema) {
          throw new Error('Invalid portfolio backup JSON schema.');
        }

        const projectCount = parsed.database.projects?.length || 0;
        const skillCount = parsed.database.skills?.length || 0;
        const serviceCount = parsed.database.services?.length || 0;

        setImportDiff({
          projectCount,
          skillCount,
          serviceCount,
          data: parsed.database,
        });
        setImportStatus('Validated successfully. Review counts and confirm to apply.');
      } catch (err: any) {
        setImportStatus(`Import Error: ${err.message || 'Failed to parse JSON file'}`);
        setImportDiff(null);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    if (!importDiff?.data) return;
    safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, importDiff.data);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-[var(--border)]">
        <h1 className="text-2xl font-bold font-display text-[var(--text)]">
          Data Backup, Export & Migration
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Export your entire studio configuration as validated JSON or restore from a previous snapshot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Export Column */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 text-[var(--accent-text)] flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[var(--text)]">
              Export Full Studio Snapshot
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Downloads all projects, skills, services, testimonials, experiences, inquiries, and site settings formatted in standard schema JSON.
            </p>
          </div>

          <button
            onClick={handleExportJson}
            className="w-full py-3.5 rounded-full bg-[var(--accent)] hover:brightness-110 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.JSON)</span>
          </button>
        </div>

        {/* Import Column */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[var(--text)]">
              Import & Restore Snapshot
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Restore previously exported configurations. Performs client-side schema validation and pre-import count verification.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[var(--surface-2)] file:text-[var(--text)] hover:file:bg-[var(--border)] cursor-pointer"
            />

            {importStatus && (
              <p className="text-xs font-mono text-[var(--accent-text)] bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--border)]">
                {importStatus}
              </p>
            )}

            {importDiff && (
              <div className="p-4 rounded-xl bg-[var(--surface-2)]/60 border border-[var(--border)] space-y-3">
                <div className="text-xs font-mono text-[var(--text)] font-semibold">
                  Payload summary: {importDiff.projectCount} projects, {importDiff.skillCount} skills, {importDiff.serviceCount} services.
                </div>
                <button
                  onClick={handleApplyImport}
                  className="w-full py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Apply & Reload Studio
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
