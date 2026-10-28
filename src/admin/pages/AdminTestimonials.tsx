import React, { useState } from 'react';
import { Plus, Trash2, Edit2, MessageSquare, X, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';

export const AdminTestimonials: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [testimonials, setTestimonials] = useState(db.testimonials);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    quote: '',
    author_name: '',
    author_role: '',
    author_company: '',
    photo_url: '',
    permission_confirmed: true,
    approval: 'approved',
    sort_order: 1,
    is_sample: false,
  });

  const refreshList = () => {
    setTestimonials([...dataProvider.getDatabase().testimonials]);
  };

  const handleOpenCreate = () => {
    setFormData({
      quote: '',
      author_name: '',
      author_role: '',
      author_company: '',
      photo_url: '',
      permission_confirmed: true,
      approval: 'approved',
      sort_order: testimonials.length + 1,
      is_sample: false,
    });
    setIsCreating(true);
    setEditingTestimonial(null);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setFormData({ ...t });
    setEditingTestimonial(t);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quote?.trim() || !formData.author_name?.trim()) return;

    if (editingTestimonial) {
      dataProvider.updateTestimonial(editingTestimonial.id, formData);
    } else {
      dataProvider.addTestimonial(formData as any);
    }

    refreshList();
    setIsCreating(false);
    setEditingTestimonial(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this testimonial?')) {
      dataProvider.deleteTestimonial(id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Testimonials & Endorsements
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Manage client quotes, enforce permission consent, and control public display approval states.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="space-y-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <p className="text-sm text-[var(--text)] italic leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <span className="font-bold text-[var(--text)]">{t.author_name}</span>
                <span>•</span>
                <span>{t.author_role} at {t.author_company}</span>
                <span>•</span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                  t.approval === 'approved' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {t.approval}
                </span>
                {t.is_sample && (
                  <span className="text-[10px] font-mono text-amber-400">Sample</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => handleOpenEdit(t)}
                className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-2 rounded-lg hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isCreating || editingTestimonial) && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => { setIsCreating(false); setEditingTestimonial(null); }} />

          <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold font-display text-[var(--text)]">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={() => { setIsCreating(false); setEditingTestimonial(null); }}>
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Endorsement Quote *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.quote ?? ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author_name ?? ''}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Role & Title
                  </label>
                  <input
                    type="text"
                    value={formData.author_role ?? ''}
                    onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.author_company ?? ''}
                    onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Approval State
                  </label>
                  <select
                    value={formData.approval ?? 'approved'}
                    onChange={(e) => setFormData({ ...formData, approval: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  >
                    <option value="approved">Approved (Public)</option>
                    <option value="pending">Pending</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={formData.permission_confirmed}
                    onChange={(e) => setFormData({ ...formData, permission_confirmed: e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Permission explicitly confirmed by author</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={!formData.is_sample}
                    onChange={(e) => setFormData({ ...formData, is_sample: !e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Mark as Real Endorsement (clears sample badge)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingTestimonial(null); }}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-md"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
