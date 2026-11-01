import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Download, Edit2, ExternalLink, Loader2, Plus, RefreshCw, Search, Trash2, Upload, X } from 'lucide-react';
import type { Project, ContentStatus } from '../../types/portfolio';
import { dataProvider } from '../../data/dataProvider';
import {
  deleteCloudProject,
  getAdminProjects,
  saveCloudProject,
  uploadProjectImage,
} from '../../data/projectRepository';

const emptyProject = (): Partial<Project> => ({
  title: '',
  slug: '',
  summary: '',
  category_id: dataProvider.getDatabase().categories[0]?.id || '',
  category_name: dataProvider.getDatabase().categories[0]?.name || 'Web Applications',
  cover_image_url: '',
  problem: '',
  approach: '',
  role: 'Web Developer',
  process: '',
  challenges: '',
  results: '',
  tools: ['React', 'JavaScript', 'Tailwind CSS'],
  project_date: new Date().toISOString().slice(0, 10),
  live_url: '',
  source_url: '',
  featured: true,
  status: 'published',
  is_sample: false,
  gallery: [],
  sort_order: 0,
});

export const AdminProjectsCloud: React.FC = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Partial<Project>>(emptyProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toolsInput, setToolsInput] = useState('React, JavaScript, Tailwind CSS');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      setProjects(await getAdminProjects());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load cloud projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = useMemo(() => projects.filter((project) =>
    project.title.toLowerCase().includes(search.toLowerCase()) ||
    project.summary.toLowerCase().includes(search.toLowerCase())
  ), [projects, search]);

  const startCreate = () => {
    setForm(emptyProject());
    setToolsInput('React, JavaScript, Tailwind CSS');
    setEditingId(null);
    setMessage('');
    setError('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const startEdit = (project: Project) => {
    setForm({ ...project });
    setToolsInput(project.tools.join(', '));
    setEditingId(project.id);
    setMessage('');
    setError('');
  };

  const handleUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadProjectImage(file);
      setForm((current) => ({ ...current, cover_image_url: url }));
      setMessage('Image uploaded to shared Supabase Storage.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title?.trim()) {
      setError('Project title is required.');
      return;
    }
    const slug = (form.slug?.trim() || form.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    if (!slug) {
      setError('Please enter a valid project title or slug.');
      return;
    }
    if (form.status === 'published' && !form.live_url?.trim()) {
      setError('Published projects need a live website URL. Paste your deployed project link before publishing.');
      return;
    }
    if (form.live_url?.trim()) {
      try {
        const liveUrl = new URL(form.live_url.trim());
        if (!['http:', 'https:'].includes(liveUrl.protocol)) throw new Error('invalid protocol');
      } catch {
        setError('Live website URL sahi nahi hai. Full link https:// se start hona chahiye.');
        return;
      }
    }
    const category = dataProvider.getDatabase().categories.find((item) => item.id === form.category_id);
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await saveCloudProject({
        ...form,
        slug,
        category_name: category?.name || form.category_name || 'Web Applications',
        tools: toolsInput.split(',').map((item) => item.trim()).filter(Boolean),
        is_sample: false,
      } as Partial<Project> & Pick<Project, 'title' | 'slug'>, editingId || undefined);
      setMessage(editingId ? 'Project updated in Supabase.' : 'Project saved to Supabase and shared across devices.');
      setForm(emptyProject());
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Project could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!window.confirm(`Delete "${project.title}" from the shared portfolio?`)) return;
    setError('');
    setMessage('');
    try {
      await deleteCloudProject(project.id);
      setProjects((current) => current.filter((item) => item.id !== project.id));
      if (editingId === project.id) startCreate();
      setMessage('Project deleted from the shared cloud database.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Project could not be deleted.');
    }
  };

  const exportProjects = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ramzan-cloud-projects-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl font-bold font-display text-[var(--text)]">Projects & Works Manager</h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">Cloud-synced projects shared by desktop, tablet, and mobile.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={exportProjects} className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] text-xs font-semibold flex items-center gap-2">
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <button type="button" onClick={() => void refresh()} className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] text-xs font-semibold flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button type="button" onClick={startCreate} className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New Project
          </button>
        </div>
      </div>

      {message && <div role="status" className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm flex items-center gap-2"><Check className="w-4 h-4" />{message}</div>}
      {error && <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)] gap-6 items-start">
        <section className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border)] flex items-center gap-3">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search cloud projects…" className="flex-1 bg-transparent outline-none text-sm text-[var(--text)]" />
            <span className="text-xs text-[var(--text-muted)]">{projects.length} total</span>
          </div>
          {loading ? (
            <div className="p-10 text-center text-[var(--text-muted)]"><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />Loading shared projects…</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-[var(--text-muted)]">No projects found. Click Add New Project to add your first project website.</div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {filtered.map((project) => (
                <div key={project.id} className="p-4 flex gap-3 items-start">
                  <div className="w-20 h-16 rounded-lg bg-[var(--surface-2)] overflow-hidden shrink-0 border border-[var(--border)]">
                    {project.cover_image_url && <img src={project.cover_image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[var(--text)] truncate">{project.title}</p>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">{project.summary}</p>
                    {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 mt-2 text-[11px] text-cyan-500 hover:underline"><ExternalLink className="w-3 h-3" />Visit live website</a>}
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-wide text-cyan-500">{project.status}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => startEdit(project)} aria-label={`Edit ${project.title}`} className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]"><Edit2 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => void handleDelete(project)} aria-label={`Delete ${project.title}`} className="p-2 rounded-lg hover:bg-red-500/10 text-red-400"><Trash2 className="w-4 h-4" /></button>
                    {project.status === 'published' && <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" aria-label="Open public project" className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]"><ExternalLink className="w-4 h-4" /></a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <form ref={formRef} onSubmit={handleSave} className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-5 space-y-4 scroll-mt-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-[var(--text)]">{editingId ? 'Edit Cloud Project' : 'Create Cloud Project'}</h2>
            {editingId && <button type="button" onClick={startCreate} className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]" aria-label="Cancel editing"><X className="w-4 h-4" /></button>}
          </div>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Project title *</span><input required value={form.title ?? ''} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">URL slug</span><input value={form.slug ?? ''} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder="auto-generated-from-title" className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Short summary</span><textarea rows={2} value={form.summary ?? ''} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Category</span><select value={form.category_id ?? ''} onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"><option value="">Other</option>{dataProvider.getDatabase().categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Project date</span><input type="date" value={form.project_date ?? ''} onChange={(event) => setForm((current) => ({ ...current, project_date: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          </div>
          <div className="space-y-2">
            <span className="text-xs text-[var(--text-muted)]">Cover image</span>
            {form.cover_image_url && <img src={form.cover_image_url} alt="Project cover preview" className="w-full aspect-video object-cover rounded-xl border border-[var(--border)]" />}
            <div className="flex flex-col sm:flex-row gap-2">
              <input value={form.cover_image_url ?? ''} onChange={(event) => setForm((current) => ({ ...current, cover_image_url: event.target.value }))} placeholder="https://image-url…" className="min-w-0 flex-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-xs text-[var(--text)]" />
              <label className="shrink-0 cursor-pointer px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] flex items-center justify-center gap-2"><Upload className="w-4 h-4" />{uploading ? 'Uploading…' : 'Upload'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" disabled={uploading} onChange={(event) => void handleUpload(event.target.files?.[0])} /></label>
            </div>
          </div>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Tools (comma separated)</span><input value={toolsInput} onChange={(event) => setToolsInput(event.target.value)} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Live project URL</span><input type="url" required={form.status === 'published'} value={form.live_url ?? ''} onChange={(event) => setForm((current) => ({ ...current, live_url: event.target.value }))} placeholder="https://your-project.pages.dev" className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
            <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Source code URL</span><input type="url" value={form.source_url ?? ''} onChange={(event) => setForm((current) => ({ ...current, source_url: event.target.value }))} placeholder="https://github.com/…" className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          </div>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Role</span><input value={form.role ?? ''} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Problem statement</span><textarea rows={2} value={form.problem ?? ''} onChange={(event) => setForm((current) => ({ ...current, problem: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Approach / strategy</span><textarea rows={2} value={form.approach ?? ''} onChange={(event) => setForm((current) => ({ ...current, approach: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Process</span><textarea rows={2} value={form.process ?? ''} onChange={(event) => setForm((current) => ({ ...current, process: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Challenges</span><textarea rows={2} value={form.challenges ?? ''} onChange={(event) => setForm((current) => ({ ...current, challenges: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Results</span><textarea rows={2} value={form.results ?? ''} onChange={(event) => setForm((current) => ({ ...current, results: event.target.value }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]" /></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block space-y-1"><span className="text-xs text-[var(--text-muted)]">Status</span><select value={form.status ?? 'draft'} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ContentStatus }))} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm text-[var(--text)]"><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option><option value="archived">Archived</option></select></label>
            <label className="flex items-center gap-2 text-sm text-[var(--text)] pt-5"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} /> Featured project</label>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving || uploading} className="flex-1 px-4 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold disabled:opacity-50">{saving ? 'Saving…' : editingId ? 'Save Changes to Cloud' : 'Publish to Shared Cloud'}</button>
            <button type="button" onClick={startCreate} className="px-4 py-3 rounded-xl border border-[var(--border)] text-[var(--text-muted)] text-sm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
};
