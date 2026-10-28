import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Briefcase, X } from 'lucide-react';
import { Experience } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';

export const AdminExperience: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [experiences, setExperiences] = useState(db.experiences);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<Experience>>({
    role: '',
    organization: '',
    location: 'Remote',
    start_date: '2023-01',
    end_date: '',
    is_current: false,
    description: '',
    highlights: ['Lead system architecture and engineering'],
    visible: true,
    sort_order: 1,
    is_sample: false,
  });

  const [highlightsInput, setHighlightsInput] = useState('Lead system architecture and engineering');

  const refreshList = () => {
    setExperiences([...dataProvider.getDatabase().experiences]);
  };

  const handleOpenCreate = () => {
    setFormData({
      role: '',
      organization: '',
      location: 'Remote',
      start_date: '2023-01',
      end_date: '',
      is_current: false,
      description: '',
      highlights: ['Lead system architecture and engineering'],
      visible: true,
      sort_order: experiences.length + 1,
      is_sample: false,
    });
    setHighlightsInput('Lead system architecture and engineering');
    setIsCreating(true);
    setEditingExp(null);
  };

  const handleOpenEdit = (exp: Experience) => {
    setFormData({ ...exp });
    setHighlightsInput(exp.highlights.join('\n'));
    setEditingExp(exp);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role?.trim() || !formData.organization?.trim()) return;

    const parsedHighlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      highlights: parsedHighlights,
    } as any;

    if (editingExp) {
      dataProvider.updateExperience(editingExp.id, payload);
    } else {
      dataProvider.addExperience(payload);
    }

    refreshList();
    setIsCreating(false);
    setEditingExp(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this career experience entry?')) {
      dataProvider.deleteExperience(id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Experience & Milestones Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Manage your career trajectory, organizations, timeline, and key outcome bullets.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-display text-[var(--text)]">
                  {exp.role}
                </h3>
                <span className="text-xs font-semibold text-[var(--accent-text)]">
                  @ {exp.organization}
                </span>
                {exp.is_current && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400">
                    Current
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                {exp.start_date} – {exp.end_date || 'Present'} • {exp.location}
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed pt-1">
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEdit(exp)}
                className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="p-2 rounded-lg hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isCreating || editingExp) && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => { setIsCreating(false); setEditingExp(null); }} />

          <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold font-display text-[var(--text)]">
                {editingExp ? 'Edit Experience' : 'Add Experience'}
              </h2>
              <button onClick={() => { setIsCreating(false); setEditingExp(null); }}>
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.role ?? ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Organization / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organization ?? ''}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location ?? ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Start Date (YYYY-MM)
                  </label>
                  <input
                    type="text"
                    value={formData.start_date ?? ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    placeholder="2022-01"
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    End Date (Leave blank if current)
                  </label>
                  <input
                    type="text"
                    value={formData.end_date ?? ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    placeholder="2024-05"
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description ?? ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Outcome Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={highlightsInput ?? ''}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={formData.is_current}
                    onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Currently working here</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={!formData.is_sample}
                    onChange={(e) => setFormData({ ...formData, is_sample: !e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Mark as Real Content</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingExp(null); }}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-md"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
