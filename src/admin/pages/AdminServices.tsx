import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Layers, X, Check } from 'lucide-react';
import { Service } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';

export const AdminServices: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [services, setServices] = useState(db.services);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    slug: '',
    icon: 'Layout',
    problem_solved: '',
    description: '',
    starting_price: 'From $2,500',
    timeline_note: 'Typical delivery: 3–4 weeks',
    deliverables: ['Custom architecture', 'Full-stack integration'],
    process_steps: ['Discovery', 'Architecture', 'Build', 'Launch'],
    visible: true,
    sort_order: 1,
    is_sample: false,
    related_project_ids: [],
  });

  const [deliverablesInput, setDeliverablesInput] = useState('Custom architecture, Full-stack integration');

  const refreshList = () => {
    setServices([...dataProvider.getDatabase().services]);
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      slug: '',
      icon: 'Layout',
      problem_solved: '',
      description: '',
      starting_price: 'From $2,500',
      timeline_note: 'Typical delivery: 3–4 weeks',
      deliverables: ['Custom architecture', 'Full-stack integration'],
      process_steps: ['Discovery', 'Architecture', 'Build', 'Launch'],
      visible: true,
      sort_order: services.length + 1,
      is_sample: false,
      related_project_ids: [],
    });
    setDeliverablesInput('Custom architecture, Full-stack integration');
    setIsCreating(true);
    setEditingService(null);
  };

  const handleOpenEdit = (srv: Service) => {
    setFormData({ ...srv });
    setDeliverablesInput(srv.deliverables.join(', '));
    setEditingService(srv);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const slug =
      formData.slug?.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const parsedDeliverables = deliverablesInput
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      slug,
      deliverables: parsedDeliverables,
    } as any;

    if (editingService) {
      dataProvider.updateService(editingService.id, payload);
    } else {
      dataProvider.addService(payload);
    }

    refreshList();
    setIsCreating(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this service offering?')) {
      dataProvider.deleteService(id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Services & Engagements Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Configure technical consulting offerings, starting prices, deliverables, and timeline notes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-[var(--accent-text)] bg-[var(--surface-2)] px-2.5 py-1 rounded-md border border-[var(--border)]">
                  {srv.starting_price}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {srv.timeline_note}
                </span>
              </div>

              <h3 className="text-lg font-bold font-display text-[var(--text)] mb-1">
                {srv.name}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                {srv.problem_solved}
              </p>

              <div className="space-y-1 mb-4">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                  Deliverables:
                </span>
                {srv.deliverables.map((d, idx) => (
                  <p key={idx} className="text-xs text-[var(--text)]">
                    • {d}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                srv.is_sample ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                {srv.is_sample ? 'Sample' : 'Real'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(srv.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isCreating || editingService) && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => { setIsCreating(false); setEditingService(null); }} />

          <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold font-display text-[var(--text)]">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => { setIsCreating(false); setEditingService(null); }}>
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name ?? ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Problem Solved Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.problem_solved ?? ''}
                  onChange={(e) => setFormData({ ...formData, problem_solved: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Starting Price Label
                  </label>
                  <input
                    type="text"
                    value={formData.starting_price ?? ''}
                    onChange={(e) => setFormData({ ...formData, starting_price: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Timeline Note
                  </label>
                  <input
                    type="text"
                    value={formData.timeline_note ?? ''}
                    onChange={(e) => setFormData({ ...formData, timeline_note: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Deliverables (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={deliverablesInput ?? ''}
                  onChange={(e) => setDeliverablesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="pt-2">
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
                  onClick={() => { setIsCreating(false); setEditingService(null); }}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-md"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
