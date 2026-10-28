import React, { useState } from 'react';
import { Plus, Trash2, Tag, FolderTree, X, Check } from 'lucide-react';
import { Category, Tag as TagType } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';

export const AdminCategories: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [categories, setCategories] = useState(db.categories);
  const [tags, setTags] = useState(db.tags);
  const [newCatName, setNewCatName] = useState('');
  const [newTagName, setNewTagName] = useState('');

  const refreshList = () => {
    setCategories([...dataProvider.getDatabase().categories]);
    setTags([...dataProvider.getDatabase().tags]);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      slug,
      sort_order: categories.length + 1,
      is_sample: false,
    };

    const currentDb = dataProvider.getDatabase();
    currentDb.categories.push(newCat);
    setNewCatName('');
    refreshList();
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this category? Associated projects will be unassigned.')) {
      const currentDb = dataProvider.getDatabase();
      currentDb.categories = currentDb.categories.filter((c) => c.id !== id);
      refreshList();
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const slug = newTagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newT: TagType = {
      id: 'tag-' + Date.now(),
      name: newTagName.trim(),
      slug,
      is_sample: false,
    };

    const currentDb = dataProvider.getDatabase();
    currentDb.tags.push(newT);
    setNewTagName('');
    refreshList();
  };

  const handleDeleteTag = (id: string) => {
    const currentDb = dataProvider.getDatabase();
    currentDb.tags = currentDb.tags.filter((t) => t.id !== id);
    refreshList();
  };

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[var(--border)]">
        <h1 className="text-2xl font-bold font-display text-[var(--text)]">
          Taxonomy & Categories Manager
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Manage project categories, filter chips, and architectural technology tags.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Manager */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
            <FolderTree className="w-5 h-5 text-[var(--accent-text)]" />
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Project Categories ({categories.length})
            </h2>
          </div>

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCatName ?? ''}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Distributed Systems"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:brightness-110 transition cursor-pointer"
            >
              Add Category
            </button>
          </form>

          <div className="divide-y divide-[var(--border)]/50">
            {categories.map((cat) => {
              const count = db.projects.filter((p) => p.category_id === cat.id).length;
              return (
                <div key={cat.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-sm text-[var(--text)]">{cat.name}</span>
                    <span className="font-mono text-[11px] text-[var(--text-muted)] ml-2">({count} projects)</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags Manager */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-card)] space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[var(--border)]">
            <Tag className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Technology Tags ({tags.length})
            </h2>
          </div>

          <form onSubmit={handleAddTag} className="flex gap-2">
            <input
              type="text"
              value={newTagName ?? ''}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="e.g. WebGPU, GraphQL"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:brightness-110 transition cursor-pointer"
            >
              Add Tag
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((t) => (
              <span
                key={t.id}
                className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono text-[var(--text)] flex items-center gap-2 group"
              >
                <span>#{t.name}</span>
                <button
                  onClick={() => handleDeleteTag(t.id)}
                  className="hover:text-red-400 transition cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
