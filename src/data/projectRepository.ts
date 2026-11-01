import { supabase } from '../lib/supabase';
import { safeStorage, STORAGE_KEYS } from '../lib/storage';
import type { Project, ProjectMedia } from '../types/portfolio';

const TABLE = 'portfolio_projects';
const BUCKET = 'portfolio-projects';

type ProjectRow = Record<string, any>;

function fromRow(row: ProjectRow): Project {
  return {
    id: String(row.id),
    slug: row.slug ?? '',
    title: row.title ?? '',
    summary: row.summary ?? '',
    category_id: row.category_id ?? '',
    category_name: row.category_name ?? 'Web Applications',
    cover_image_url: row.cover_image_url ?? '',
    demo_video_url: row.demo_video_url ?? '',
    problem: row.problem ?? '',
    approach: row.approach ?? '',
    role: row.role ?? '',
    process: row.process ?? '',
    challenges: row.challenges ?? '',
    results: row.results ?? '',
    tools: Array.isArray(row.tools) ? row.tools : [],
    project_date: row.project_date ?? row.created_at?.slice(0, 10) ?? '',
    live_url: row.live_url ?? '',
    source_url: row.source_url ?? '',
    featured: Boolean(row.featured),
    status: row.status ?? 'draft',
    publish_at: row.publish_at ?? undefined,
    seo_title: row.seo_title ?? undefined,
    seo_description: row.seo_description ?? undefined,
    sort_order: Number(row.sort_order ?? 0),
    view_count: Number(row.view_count ?? 0),
    is_sample: Boolean(row.is_sample),
    gallery: Array.isArray(row.gallery) ? (row.gallery as ProjectMedia[]) : [],
    created_at: row.created_at ?? new Date().toISOString(),
    updated_at: row.updated_at ?? new Date().toISOString(),
  };
}

function toRow(project: Partial<Project>, id: string): ProjectRow {
  return {
    id,
    slug: project.slug,
    title: project.title,
    summary: project.summary ?? '',
    category_id: project.category_id || null,
    category_name: project.category_name ?? 'Web Applications',
    cover_image_url: project.cover_image_url ?? '',
    demo_video_url: project.demo_video_url || null,
    problem: project.problem ?? '',
    approach: project.approach ?? '',
    role: project.role ?? '',
    process: project.process ?? '',
    challenges: project.challenges ?? '',
    results: project.results ?? '',
    tools: project.tools ?? [],
    project_date: project.project_date || null,
    live_url: project.live_url || null,
    source_url: project.source_url || null,
    featured: Boolean(project.featured),
    status: project.status ?? 'draft',
    publish_at: project.publish_at || null,
    seo_title: project.seo_title || null,
    seo_description: project.seo_description || null,
    sort_order: Number(project.sort_order ?? 0),
    is_sample: false,
    gallery: project.gallery ?? [],
    updated_at: new Date().toISOString(),
  };
}

async function requirePortfolioAdmin() {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new Error('Admin session expired. Please sign in again.');
  }
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();
  if (error || profile?.role !== 'admin') {
    throw new Error('Your account does not have portfolio administrator access.');
  }
  return authData.user;
}

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function getPublishedProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

export async function getAdminProjects(): Promise<Project[]> {
  await requirePortfolioAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function saveCloudProject(
  project: Partial<Project> & Pick<Project, 'title' | 'slug'>,
  existingId?: string
): Promise<Project> {
  await requirePortfolioAdmin();
  const id = existingId || `proj-${crypto.randomUUID()}`;
  const row = toRow(project, id);
  if (!existingId) row.created_at = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(row, { onConflict: 'id' })
    .select('*')
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteCloudProject(id: string): Promise<void> {
  await requirePortfolioAdmin();
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function uploadProjectImage(file: File): Promise<string> {
  await requirePortfolioAdmin();
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowed.includes(file.type)) {
    throw new Error('Please upload a JPG, PNG, WebP, or GIF image.');
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error('Image size must be 8 MB or less.');
  }
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function dataUrlToFile(value: string, filename: string): Promise<File> {
  return fetch(value).then(async (response) => {
    const blob = await response.blob();
    const safeType = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(blob.type)
      ? blob.type
      : 'image/png';
    return new File([blob], filename, { type: safeType });
  });
}

async function migrateLegacyImage(value: string, prefix: string): Promise<string> {
  if (!value?.startsWith('data:image/')) return value || '';
  const file = await dataUrlToFile(value, `${prefix}.png`);
  return uploadProjectImage(file);
}

/**
 * Imports only non-sample projects from this browser's legacy Local Storage.
 * Existing cloud rows are never overwritten; matching IDs or slugs are skipped.
 */
export async function importLegacyLocalProjects(): Promise<{ imported: number; skipped: number }> {
  await requirePortfolioAdmin();
  const legacy = safeStorage.getJSON<{ projects?: Project[] } | null>(STORAGE_KEYS.DEMO_DATA, null);
  const localProjects = Array.isArray(legacy?.projects)
    ? legacy!.projects!.filter((project) => project && !project.is_sample)
    : [];
  if (!localProjects.length) return { imported: 0, skipped: 0 };

  const { data: cloudRows, error } = await supabase.from(TABLE).select('id,slug');
  if (error) throw error;
  const ids = new Set((cloudRows ?? []).map((row) => String(row.id)));
  const slugs = new Set((cloudRows ?? []).map((row) => String(row.slug)));
  let imported = 0;
  let skipped = 0;

  for (const project of localProjects) {
    if (ids.has(String(project.id)) || slugs.has(project.slug)) {
      skipped += 1;
      continue;
    }
    const cover = await migrateLegacyImage(project.cover_image_url, `cover-${project.id}`);
    const gallery = await Promise.all(
      (project.gallery ?? []).map(async (media, index) => ({
        ...media,
        url: await migrateLegacyImage(media.url, `gallery-${project.id}-${index}`),
      }))
    );
    const row = {
      ...toRow({ ...project, cover_image_url: cover, gallery }, project.id),
      created_at: project.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const { error: insertError } = await supabase.from(TABLE).insert(row);
    if (insertError) throw new Error(`Could not import "${project.title}": ${insertError.message}`);
    ids.add(String(project.id));
    slugs.add(project.slug);
    imported += 1;
  }
  return { imported, skipped };
}

export function subscribeToProjectChanges(onChange: () => void): () => void {
  const channel = supabase
    .channel('portfolio-projects-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, onChange)
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}
