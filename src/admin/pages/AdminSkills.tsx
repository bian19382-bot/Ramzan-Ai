import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Wrench, X, Check } from 'lucide-react';
import { Skill, SkillGroup } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';

export const AdminSkills: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [skills, setSkills] = useState(db.skills);
  const [skillGroups] = useState(db.skill_groups);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    context: '',
    group_id: skillGroups[0]?.id || 'sg-1',
    is_tool: false,
    visible: true,
    sort_order: 1,
    is_sample: false,
    logo_icon: 'Code',
  });

  const refreshList = () => {
    setSkills([...dataProvider.getDatabase().skills]);
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      context: '',
      group_id: skillGroups[0]?.id || 'sg-1',
      is_tool: false,
      visible: true,
      sort_order: skills.length + 1,
      is_sample: false,
      logo_icon: 'Code',
    });
    setIsCreating(true);
    setEditingSkill(null);
  };

  const handleOpenEdit = (skill: Skill) => {
    setFormData({ ...skill });
    setEditingSkill(skill);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    const group = skillGroups.find((g) => g.id === formData.group_id);

    const payload = {
      ...formData,
      group_name: group?.name || 'General',
    } as any;

    if (editingSkill) {
      dataProvider.updateSkill(editingSkill.id, payload);
    } else {
      dataProvider.addSkill(payload);
    }

    refreshList();
    setIsCreating(false);
    setEditingSkill(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this skill entry?')) {
      dataProvider.deleteSkill(id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Skills & Tools Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Organize skills by architectural discipline with real-world context descriptions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-muted)]">
            <thead className="bg-[var(--surface-2)]/60 border-b border-[var(--border)] text-[11px] font-mono uppercase tracking-wider text-[var(--text)]">
              <tr>
                <th className="py-3.5 px-4">Skill Name</th>
                <th className="py-3.5 px-4">Category Group</th>
                <th className="py-3.5 px-4">Context / Real-World Focus</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Sample</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50">
              {skills.map((sk) => (
                <tr key={sk.id} className="hover:bg-[var(--surface-2)]/30 transition">
                  <td className="py-3.5 px-4 font-semibold text-sm text-[var(--text)]">
                    {sk.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--accent-text)]">
                    {sk.group_name}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[var(--text-muted)] max-w-xs">
                    {sk.context}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
                      {sk.is_tool ? 'Tool' : 'Core'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {sk.is_sample ? (
                      <span className="text-[10px] font-mono text-amber-400">Sample</span>
                    ) : (
                      <span className="text-[10px] font-mono text-emerald-400">Real</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(sk)}
                      className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sk.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(isCreating || editingSkill) && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => { setIsCreating(false); setEditingSkill(null); }} />

          <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold font-display text-[var(--text)]">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button onClick={() => { setIsCreating(false); setEditingSkill(null); }}>
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name ?? ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Next.js 15 Server Components"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Category Group
                </label>
                <select
                  value={formData.group_id ?? ''}
                  onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                >
                  {skillGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Real-World Context & Focus
                </label>
                <textarea
                  rows={2}
                  value={formData.context ?? ''}
                  onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                  placeholder="e.g. Streaming SSR, zero bundle overhead, edge computing"
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={!!formData.is_tool}
                    onChange={(e) => setFormData({ ...formData, is_tool: e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Is Tool/Software (Displays in tools wall)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={!formData.is_sample}
                    onChange={(e) => setFormData({ ...formData, is_sample: !e.target.checked })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Mark as Real (clears sample badge)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingSkill(null); }}
                  className="px-4 py-2 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--text)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold cursor-pointer shadow-md"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
