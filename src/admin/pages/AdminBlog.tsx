import React, { useState } from 'react';
import { Plus, Trash2, Edit2, BookOpen, Clock, Tag, X, Check } from 'lucide-react';
import { BlogPost, ContentStatus } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';

export const AdminBlog: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [posts, setPosts] = useState(db.blog_posts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    category_name: 'AI Engineering',
    cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Architecture', 'TypeScript'],
    reading_minutes: 5,
    status: 'published' as ContentStatus,
    is_sample: false,
  });

  const [tagsInput, setTagsInput] = useState('Architecture, TypeScript');

  const refreshList = () => {
    setPosts([...dataProvider.getDatabase().blog_posts]);
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      category_name: 'AI Engineering',
      cover_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      tags: ['Architecture', 'TypeScript'],
      reading_minutes: 5,
      status: 'published',
      is_sample: false,
    });
    setTagsInput('Architecture, TypeScript');
    setIsCreating(true);
    setEditingPost(null);
  };

  const handleOpenEdit = (p: BlogPost) => {
    setFormData({ ...p });
    setTagsInput(p.tags.join(', '));
    setEditingPost(p);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    const slug =
      formData.slug?.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      slug,
      tags: parsedTags,
    } as any;

    const currentDb = dataProvider.getDatabase();
    if (editingPost) {
      currentDb.blog_posts = currentDb.blog_posts.map((p) =>
        p.id === editingPost.id ? { ...p, ...payload, updated_at: new Date().toISOString() } : p
      );
    } else {
      const newPost: BlogPost = {
        ...payload,
        id: 'post-' + Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      currentDb.blog_posts.unshift(newPost);
    }

    refreshList();
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this blog article?')) {
      const currentDb = dataProvider.getDatabase();
      currentDb.blog_posts = currentDb.blog_posts.filter((p) => p.id !== id);
      refreshList();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Technical Insights & Articles
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Author and publish deep architectural articles, case study breakdowns, and thought leadership.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write Article</span>
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-[var(--surface-2)] text-[var(--accent-text)] px-2 py-0.5 rounded border border-[var(--border)]">
                  {post.category_name}
                </span>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {post.reading_minutes} min read
                </span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                  post.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-zinc-500/15 text-zinc-400'
                }`}>
                  {post.status}
                </span>
              </div>

              <h3 className="text-base font-bold font-display text-[var(--text)]">
                {post.title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => handleOpenEdit(post)}
                className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-2 rounded-lg hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {(isCreating || editingPost) && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => { setIsCreating(false); setEditingPost(null); }} />

          <div className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h2 className="text-lg font-bold font-display text-[var(--text)]">
                {editingPost ? 'Edit Article' : 'Write Article'}
              </h2>
              <button onClick={() => { setIsCreating(false); setEditingPost(null); }}>
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title ?? ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Architecting High-Thinking AI Agents"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.category_name ?? ''}
                    onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Reading Minutes
                  </label>
                  <input
                    type="number"
                    value={formData.reading_minutes ?? 5}
                    onChange={(e) => setFormData({ ...formData, reading_minutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Short Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt ?? ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Article Markdown Body
                </label>
                <textarea
                  rows={6}
                  value={formData.body ?? ''}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Tags (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={tagsInput ?? ''}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text)]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={formData.status === 'published'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'published' : 'draft' })}
                    className="rounded text-[var(--accent)]"
                  />
                  <span>Publish Immediately</span>
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsCreating(false); setEditingPost(null); }}
                    className="px-4 py-2 rounded-xl bg-[var(--surface-2)] text-xs text-[var(--text)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold shadow-md"
                  >
                    Save Article
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
