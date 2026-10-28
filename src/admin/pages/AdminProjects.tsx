import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Copy,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  FolderKanban,
  Link,
  Github,
} from 'lucide-react';
import { Project, ContentStatus } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';

export const AdminProjects: React.FC = () => {
  const db = dataProvider.getDatabase();
  const [projects, setProjects] = useState(db.projects);
  const [search, setSearch] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    summary: '',
    category_id: db.categories[0]?.id || 'cat-1',
    category_name: db.categories[0]?.name || 'Web Applications',
    cover_image_url: '',
    problem: '',
    approach: '',
    role: 'Web Developer',
    process: '',
    challenges: '',
    results: '',
    tools: ['React', 'JavaScript', 'Tailwind CSS'],
    project_date: new Date().toISOString().split('T')[0],
    live_url: '',
    source_url: '',
    featured: true,
    status: 'published' as ContentStatus,
    is_sample: false,
    gallery: [],
  });

  const [toolsInput, setToolsInput] = useState('React, JavaScript, Tailwind CSS');
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');

  const refreshList = () => {
    setProjects([...dataProvider.getDatabase().projects]);
  };

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      slug: '',
      summary: '',
      category_id: db.categories[0]?.id || 'cat-1',
      category_name: db.categories[0]?.name || 'Web Applications',
      cover_image_url: '',
      problem: '',
      approach: '',
      role: 'Web Developer',
      process: '',
      challenges: '',
      results: '',
      tools: ['React', 'JavaScript', 'Tailwind CSS'],
      project_date: new Date().toISOString().split('T')[0],
      live_url: '',
      source_url: '',
      featured: true,
      status: 'published',
      is_sample: false,
      gallery: [],
    });
    setToolsInput('React, JavaScript, Tailwind CSS');
    setImageMode('upload');
    setIsCreating(true);
    setEditingProject(null);
  };

  const handleOpenEdit = (proj: Project) => {
    setFormData({ ...proj });
    setToolsInput(proj.tools.join(', '));
    setImageMode(proj.cover_image_url.startsWith('data:') ? 'upload' : 'url');
    setEditingProject(proj);
    setIsCreating(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, cover_image_url: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDropFile = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please drop a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData((prev) => ({ ...prev, cover_image_url: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert('Please enter a project title');
      return;
    }

    const slug =
      formData.slug?.trim() ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const selectedCategory = db.categories.find((c) => c.id === formData.category_id);
    const parsedTools = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Fallback cover image if none provided
    const fallbackImage =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><rect width="800" height="500" fill="%2318181b"/><text x="400" y="250" fill="%23a1a1aa" font-family="sans-serif" font-size="24" text-anchor="middle">Project Screenshot</text></svg>';

    const projectPayload = {
      ...formData,
      slug,
      cover_image_url: formData.cover_image_url?.trim() || fallbackImage,
      category_name: selectedCategory?.name || formData.category_name || 'Web Applications',
      tools: parsedTools.length > 0 ? parsedTools : ['Web Development'],
      sort_order: formData.sort_order || 1,
      is_sample: false,
    } as any;

    if (editingProject) {
      dataProvider.updateProject(editingProject.id, projectPayload);
    } else {
      dataProvider.addProject(projectPayload);
    }

    refreshList();
    setIsCreating(false);
    setEditingProject(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      dataProvider.deleteProject(id);
      refreshList();
    }
  };

  const handleDuplicate = (p: Project) => {
    const duplicatePayload = {
      ...p,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft' as ContentStatus,
      is_sample: false,
    };
    dataProvider.addProject(duplicatePayload);
    refreshList();
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">
            Projects & Works Manager
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
            Add real web development projects with screenshots, descriptions, tools, and live links.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search ?? ''}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, stack, or summary..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {/* Projects Table or Empty State */}
      <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shadow-[var(--shadow-card)]">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--text-muted)]">
              <thead className="bg-[var(--surface-2)]/60 border-b border-[var(--border)] text-[11px] font-mono uppercase tracking-wider text-[var(--text)]">
                <tr>
                  <th className="py-3.5 px-4">Screenshot</th>
                  <th className="py-3.5 px-4">Title & Slug</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/50">
                {filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[var(--surface-2)]/30 transition">
                    <td className="py-3 px-4">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-[var(--surface-2)] border border-[var(--border)] shrink-0">
                        {proj.cover_image_url ? (
                          <img
                            src={proj.cover_image_url}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                            <ImageIcon className="w-4 h-4 opacity-50" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-sm text-[var(--text)] line-clamp-1">
                        {proj.title}
                      </div>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        /{proj.slug}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-[var(--text)]">
                      {proj.category_name}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                          proj.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-500/15 text-zinc-400 border border-zinc-500/30'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {proj.featured ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(proj)}
                        className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                        title="Edit project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(proj)}
                        className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] transition cursor-pointer"
                        title="Duplicate project"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400 transition cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4 text-[var(--text-muted)]">
              <FolderKanban className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <h3 className="text-lg font-bold font-display text-[var(--text)] mb-2">
              No Projects Added Yet
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto mb-6">
              All dummy projects have been cleared. Click below to add your first real web development project with screenshot, live link, and details.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Project Modal */}
      {(isCreating || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6">
              <h2 className="text-xl font-bold font-display text-[var(--text)]">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingProject(null);
                }}
                className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Picture Upload / URL Section */}
              <div className="rounded-xl p-4 bg-[var(--surface-2)]/50 border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text)] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[var(--accent)]" />
                    <span>Project Picture / Screenshot *</span>
                  </label>
                  <div className="flex items-center gap-1 p-0.5 bg-[var(--surface-2)] rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        imageMode === 'upload'
                          ? 'bg-[var(--accent)] text-white font-semibold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-3 py-1 rounded-md transition cursor-pointer ${
                        imageMode === 'url'
                          ? 'bg-[var(--accent)] text-white font-semibold'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {/* Upload from device */}
                {imageMode === 'upload' ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDropFile}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-6 text-center cursor-pointer transition hover:bg-[var(--surface-2)]/60"
                    >
                      <Upload className="w-8 h-8 text-[var(--accent)] mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-semibold text-[var(--text)]">
                        Click to browse or drag & drop project screenshot
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        PNG, JPG, WEBP, or SVG supported. Automatically optimized for web display.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={formData.cover_image_url ?? ''}
                      onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                      placeholder="https://example.com/project-screenshot.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                )}

                {/* Picture Preview */}
                {formData.cover_image_url && (
                  <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-black/40 aspect-[16/9] max-h-48">
                    <img
                      src={formData.cover_image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cover_image_url: '' })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/75 hover:bg-red-500 text-white text-xs transition cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/75 text-[10px] font-mono text-emerald-400">
                      ✓ Image Ready
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title ?? ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Modern E-Commerce Platform"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category_id ?? ''}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    {db.categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary / Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Project Description & Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.summary ?? ''}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Describe what this website or application does, key features implemented, and how it helps the user or business..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Tools & Tech Stack */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Tools & Technologies (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={toolsInput ?? ''}
                  onChange={(e) => setToolsInput(e.target.value)}
                  placeholder="React, TypeScript, Tailwind CSS, Node.js"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Examples: React, JavaScript, HTML5, CSS3, Tailwind CSS, Next.js, Node.js, Express, MongoDB
                </p>
              </div>

              {/* Live Link & Source Code Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
                    <Link className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>Live Website / Demo URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.live_url ?? ''}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://myproject.com or https://vercel.app"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1 flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span>GitHub / Source Code URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.source_url ?? ''}
                    onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              {/* Status and Featured Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[var(--border)]">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--text)]">
                    <input
                      type="checkbox"
                      checked={formData.featured ?? false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded text-[var(--accent)]"
                    />
                    <span className="font-medium">Mark as Featured</span>
                  </label>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[var(--text-muted)]">Status:</span>
                    <select
                      value={formData.status ?? 'published'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                      className="px-2.5 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProject(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--text)] cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-xs font-semibold text-white shadow-md cursor-pointer transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Project</span>
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
