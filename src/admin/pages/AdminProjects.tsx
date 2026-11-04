import React, { useState, useEffect, useRef } from 'react';
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
  Download,
  Github,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Project, ContentStatus } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';
import { motion, AnimatePresence } from 'motion/react';
import { spinInFontVariants, collidingSparksVariants, collidingSparksBackdropVariants } from '../../lib/animations';
import { soundFx } from '../../lib/soundFx';
import { CollidingSparksBurst } from '../../components/ui/CollidingSparksBurst';

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionNotification, setActionNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshList = () => {
    setProjects([...dataProvider.getDatabase().projects]);
  };

  useEffect(() => {
    void dataProvider.syncWithSupabase();
    return dataProvider.subscribe(() => {
      refreshList();
    });
  }, []);

  const compressImageFile = (file: File, maxWidth = 1200, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve((event.target?.result as string) || '');
          }
        };
        img.onerror = () => resolve((event.target?.result as string) || '');
        img.src = (event.target?.result as string) || '';
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
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
      sort_order: db.projects.length + 1,
      is_sample: false,
      gallery: [],
    });
    setToolsInput('React, JavaScript, Tailwind CSS');
    setImageMode('upload');
    setEditingProject(null);
    setSaveError(null);
    setSaveSuccess(false);
    setIsCreating(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setFormData({ ...proj });
    setToolsInput(proj.tools.join(', '));
    setImageMode(proj.cover_image_url.startsWith('data:') ? 'upload' : 'url');
    setEditingProject(proj);
    setSaveError(null);
    setSaveSuccess(false);
    setIsCreating(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }

    const compressed = await compressImageFile(file);
    if (compressed) {
      setFormData((prev) => ({ ...prev, cover_image_url: compressed }));
    }
  };

  const handleDropFile = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please drop a valid image file');
      return;
    }

    const compressed = await compressImageFile(file);
    if (compressed) {
      setFormData((prev) => ({ ...prev, cover_image_url: compressed }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      setSaveError('Please enter a project title');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

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
      '/assets/brand/ramzan-logo.png';

    const fullText = (formData.summary || formData.problem || '').trim();
    const safeSummary = fullText.length > 490 ? fullText.slice(0, 487) + '...' : fullText;

    const projectPayload = {
      ...formData,
      slug,
      summary: safeSummary,
      problem: fullText,
      cover_image_url: formData.cover_image_url?.trim() || fallbackImage,
      category_name: selectedCategory?.name || formData.category_name || 'Web Development',
      tools: parsedTools.length > 0 ? parsedTools : ['Web Development'],
      sort_order: formData.sort_order || 1,
      is_sample: false,
    } as any;

    try {
      if (editingProject) {
        const res = await dataProvider.updateProject(editingProject.id, projectPayload);
        if (!res.success) {
          setSaveError(res.error || 'Failed to update project in cloud database.');
          setIsSaving(false);
          return;
        }
      } else {
        const res = await dataProvider.addProject(projectPayload);
        if (!res.success) {
          setSaveError(res.error || 'Failed to save project to cloud database. Please verify credentials.');
          setIsSaving(false);
          return;
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setSaveSuccess(false);
        refreshList();
        setIsCreating(false);
        setEditingProject(null);
      }, 500);
    } catch (err: any) {
      setSaveError(err?.message || 'Error occurred while saving to cloud database.');
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (proj: Project) => {
    const newStatus: ContentStatus = proj.status === 'published' ? 'draft' : 'published';
    setTogglingId(proj.id);
    setActionNotification(null);
    try {
      const res = await dataProvider.updateProject(proj.id, { status: newStatus });
      if (!res.success) {
        setActionNotification({
          type: 'error',
          text: res.error || 'Failed to update project status in cloud database.',
        });
      } else {
        setActionNotification({
          type: 'success',
          text:
            newStatus === 'published'
              ? `"${proj.title}" is now LIVE and visible on the website!`
              : `"${proj.title}" is now HIDDEN from the website (Draft).`,
        });
        refreshList();
      }
    } catch (err: any) {
      setActionNotification({
        type: 'error',
        text: err?.message || 'Error occurred while updating visibility.',
      });
    } finally {
      setTogglingId(null);
      setTimeout(() => setActionNotification(null), 4000);
    }
  };

  const handleDelete = async (id: string, title?: string) => {
    const projectTitle = title || 'this project';
    if (!window.confirm(`Are you sure you want to permanently delete "${projectTitle}"?\n\nThis will remove it from the website and the Supabase cloud database.`)) {
      return;
    }

    setDeletingId(id);
    setActionNotification(null);
    try {
      const res = await dataProvider.deleteProject(id);
      if (!res.success) {
        setActionNotification({
          type: 'error',
          text: res.error || 'Failed to delete project from cloud database.',
        });
      } else {
        setActionNotification({
          type: 'success',
          text: `Project "${projectTitle}" permanently deleted.`,
        });
        refreshList();
      }
    } catch (err: any) {
      setActionNotification({
        type: 'error',
        text: err?.message || 'Error occurred while deleting project.',
      });
    } finally {
      setDeletingId(null);
      setTimeout(() => setActionNotification(null), 4000);
    }
  };

  const handleDuplicate = async (p: Project) => {
    const duplicatePayload = {
      ...p,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft' as ContentStatus,
      is_sample: false,
    };
    await dataProvider.addProject(duplicatePayload);
    refreshList();
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header with Spin-In Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <motion.h1
            variants={spinInFontVariants}
            initial="hidden"
            animate="visible"
            className="text-2xl font-bold font-display text-[var(--text)]"
          >
            Projects & Works Manager
          </motion.h1>
          <motion.p
            variants={spinInFontVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-xs sm:text-sm text-[var(--text-muted)] mt-1"
          >
            Add real web development projects with screenshots, descriptions, tools, and live links.
          </motion.p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <motion.button
            variants={spinInFontVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            type="button"
            onClick={() => {
              const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute('href', dataStr);
              downloadAnchor.setAttribute('download', `ramzan_projects_${new Date().toISOString().split('T')[0]}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/80 text-[var(--text)] border border-[var(--border)] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download all projects as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </motion.button>

          <motion.button
            variants={spinInFontVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-white text-xs sm:text-sm font-semibold transition flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </motion.button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
            actionNotification.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
              : 'bg-red-950/60 border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionNotification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{actionNotification.text}</span>
          </div>
          <button
            onClick={() => setActionNotification(null)}
            className="p-1 rounded hover:bg-black/20 text-current cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
                  <th className="py-3.5 px-4">Visibility / Status</th>
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
                      <button
                        type="button"
                        disabled={togglingId === proj.id}
                        onClick={() => handleToggleVisibility(proj)}
                        className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase inline-flex items-center gap-1.5 transition cursor-pointer active:scale-95 disabled:opacity-50 ${
                          proj.status === 'published'
                            ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        }`}
                        title={
                          proj.status === 'published'
                            ? 'Click to HIDE this project from website (Draft)'
                            : 'Click to SHOW this project on website (Publish)'
                        }
                      >
                        {togglingId === proj.id ? (
                          <div className="w-2.5 h-2.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : proj.status === 'published' ? (
                          <Eye className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-amber-500" />
                        )}
                        <span>{proj.status === 'published' ? 'Live on Site' : 'Hidden (Draft)'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      {proj.featured ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5">
                      <button
                        disabled={togglingId === proj.id}
                        onClick={() => handleToggleVisibility(proj)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          proj.status === 'published'
                            ? 'hover:bg-amber-500/15 text-[var(--text-muted)] hover:text-amber-600 dark:hover:text-amber-400'
                            : 'hover:bg-emerald-500/15 text-[var(--text-muted)] hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                        title={proj.status === 'published' ? 'Hide from website' : 'Show on website'}
                      >
                        {proj.status === 'published' ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
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
                        disabled={deletingId === proj.id}
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="p-1.5 rounded-lg hover:bg-red-500/15 text-[var(--text-muted)] hover:text-red-400 transition cursor-pointer disabled:opacity-50"
                        title="Delete project permanently"
                      >
                        {deletingId === proj.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
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

      {/* Create / Edit Project Modal with Colliding Sparks Animation & Spin In Font */}
      <AnimatePresence>
        {(isCreating || editingProject) && (
          <motion.div
            variants={collidingSparksBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              variants={collidingSparksVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-3xl rounded-[24px] bg-[var(--surface)] border border-amber-400/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.25)] my-8 max-h-[90vh] overflow-y-auto group"
            >
              {/* Kinetic Spark Particles Collision Burst Effect */}
              <CollidingSparksBurst count={32} />

              {/* Colliding Sparks Plasma Glow Aura */}
              <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-amber-500/25 via-cyan-400/25 to-violet-500/25 blur-xl opacity-80 pointer-events-none animate-pulse" />

              <div className="relative flex items-center justify-between pb-4 border-b border-[var(--border)] mb-6 z-10">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <motion.h2
                    variants={spinInFontVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-xl font-bold font-display text-[var(--text)]"
                  >
                    {editingProject ? 'Edit Project // Colliding Sparks Editor' : 'Add New Project // Colliding Sparks Creator'}
                  </motion.h2>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClose();
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
                    <span className="text-[var(--text-muted)] font-medium">Website Visibility:</span>
                    <select
                      value={formData.status ?? 'published'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                      className="px-3 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] font-medium"
                    >
                      <option value="published">🟢 Published (Visible on Website)</option>
                      <option value="draft">⚪ Draft (Hidden from Website)</option>
                    </select>
                  </div>
                </div>

                {/* Error and Success Alerts */}
                {saveError && (
                  <div className="w-full p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}
                {saveSuccess && (
                  <div className="w-full p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Project Supabase cloud database ma kamyabi sy save ho gya ha!</span>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProject(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--text)] cursor-pointer transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-[var(--accent)] hover:brightness-110 active:scale-95 text-xs font-semibold text-white shadow-md cursor-pointer transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Cloud ma Save ho rha ha...</span>
                      </>
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Saved to Cloud!</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingProject ? 'Update Project' : 'Save Project'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
