import {
  Profile,
  SiteSettings,
  SocialLink,
  NavItem,
  HomeSection,
  IntroVideoSettings,
  Category,
  Tag,
  Project,
  Skill,
  SkillGroup,
  Experience,
  Education,
  Certification,
  Achievement,
  Service,
  FAQ,
  Testimonial,
  BlogPost,
  Inquiry,
  AnalyticsEvent,
  AuditLog,
} from '../types/portfolio';
import {
  INITIAL_PROFILE,
  INITIAL_SETTINGS,
  INITIAL_SOCIAL_LINKS,
  INITIAL_NAV_ITEMS,
  INITIAL_HOME_SECTIONS,
  INITIAL_INTRO_VIDEO,
  INITIAL_CATEGORIES,
  INITIAL_TAGS,
  INITIAL_PROJECTS,
  INITIAL_SKILL_GROUPS,
  INITIAL_SKILLS,
  INITIAL_EXPERIENCES,
  INITIAL_EDUCATION,
  INITIAL_CERTIFICATIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_SERVICES,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_BLOG_POSTS,
  INITIAL_INQUIRIES,
} from './initialData';
import { safeStorage, STORAGE_KEYS } from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { loadPortfolioContent, syncPortfolioContent } from './supabasePortfolioContent';

export interface PortfolioDatabase {
  profile: Profile;
  settings: SiteSettings;
  social_links: SocialLink[];
  nav_items: NavItem[];
  home_sections: HomeSection[];
  intro_video: IntroVideoSettings;
  categories: Category[];
  tags: Tag[];
  projects: Project[];
  skill_groups: SkillGroup[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  certifications: Certification[];
  achievements: Achievement[];
  services: Service[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  blog_posts: BlogPost[];
  inquiries: Inquiry[];
  analytics_events: AnalyticsEvent[];
  audit_logs: AuditLog[];
}

function getDefaultDatabase(): PortfolioDatabase {
  return {
    profile: INITIAL_PROFILE,
    settings: INITIAL_SETTINGS,
    social_links: INITIAL_SOCIAL_LINKS,
    nav_items: INITIAL_NAV_ITEMS,
    home_sections: INITIAL_HOME_SECTIONS,
    intro_video: INITIAL_INTRO_VIDEO,
    categories: INITIAL_CATEGORIES,
    tags: INITIAL_TAGS,
    projects: INITIAL_PROJECTS,
    skill_groups: INITIAL_SKILL_GROUPS,
    skills: INITIAL_SKILLS,
    experiences: INITIAL_EXPERIENCES,
    education: INITIAL_EDUCATION,
    certifications: INITIAL_CERTIFICATIONS,
    achievements: INITIAL_ACHIEVEMENTS,
    services: INITIAL_SERVICES,
    faqs: INITIAL_FAQS,
    testimonials: INITIAL_TESTIMONIALS,
    blog_posts: INITIAL_BLOG_POSTS,
    inquiries: INITIAL_INQUIRIES,
    analytics_events: [],
    audit_logs: [
      {
        id: 'log-1',
        at: new Date().toISOString(),
        action: 'import',
        table_name: 'database',
        summary: 'Demo workspace initialized with sample datasets',
      },
    ],
  };
}

export async function ensureAdminSession(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { data, error } = await supabase.auth.getSession();
    return !error && Boolean(data.session?.user);
  } catch (err) {
    console.warn('[ensureAdminSession] Session check failed:', err);
    return false;
  }
}

class DataProviderService {
  private db: PortfolioDatabase;
  private listeners: Set<() => void> = new Set();

  public getDeletedTombstones(): Array<{ id?: string; slug?: string; title?: string }> {
    return safeStorage.getJSON<Array<{ id?: string; slug?: string; title?: string }>>(
      STORAGE_KEYS.DELETED_PROJECTS,
      []
    );
  }

  public addDeletedTombstone(id?: string, slug?: string, title?: string): void {
    const current = this.getDeletedTombstones();
    const updated = [
      ...current.filter((item) => (id && item.id !== id) || (slug && item.slug !== slug)),
      {
        id: id || undefined,
        slug: slug ? slug.toLowerCase().trim() : undefined,
        title: title ? title.toLowerCase().trim() : undefined,
      },
    ];
    safeStorage.setJSON(STORAGE_KEYS.DELETED_PROJECTS, updated);
  }

  public isTombstoned(p: { id?: string; slug?: string; title?: string }): boolean {
    const tombstones = this.getDeletedTombstones();
    if (!tombstones || tombstones.length === 0) return false;
    const pSlug = p.slug?.toLowerCase().trim();
    const pTitle = p.title?.toLowerCase().trim();
    return tombstones.some((t) => {
      if (t.id && p.id && t.id === p.id) return true;
      if (t.slug && pSlug && t.slug === pSlug) return true;
      if (t.title && pTitle && t.title === pTitle) return true;
      return false;
    });
  }

  constructor() {
    const defaultDb = getDefaultDatabase();
    let stored: PortfolioDatabase | null = null;
    try {
      stored = safeStorage.getJSON<PortfolioDatabase | null>(STORAGE_KEYS.DEMO_DATA, null);
    } catch {
      stored = null;
    }

    if (!stored || (stored.profile?.full_name !== 'Ramzan' && stored.profile?.full_name !== 'Ramzan Ghafoor')) {
      stored = defaultDb;
      // Filter out tombstoned items from initial projects
      stored.projects = INITIAL_PROJECTS.filter((p) => !this.isTombstoned(p));
      safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, stored);
    } else {
      // Safely ensure nested objects and arrays exist
      stored.profile = { ...defaultDb.profile, ...(stored.profile || {}) };
      if (!stored.profile.welcome_banner_url || stored.profile.welcome_banner_url.includes('Neon_Portfolio_Hero')) {
        stored.profile.welcome_banner_url = '/assets/aistudio/Thoughtful_Developer_at_Workstation_c68f193a.png';
        stored.profile.portrait_url = '/assets/aistudio/Thoughtful_Developer_at_Workstation_c68f193a.png';
      }
      stored.settings = {
        ...defaultDb.settings,
        ...(stored.settings || {}),
        feature_flags: {
          ...defaultDb.settings.feature_flags,
          ...(stored.settings?.feature_flags || {}),
        },
      };

      const rawProjects = Array.isArray(stored.projects) && stored.projects.length > 0 ? stored.projects : INITIAL_PROJECTS;
      stored.projects = rawProjects.filter((p) => !this.isTombstoned(p));
      stored.categories = Array.isArray(stored.categories) ? stored.categories : defaultDb.categories;
      stored.skills = Array.isArray(stored.skills) ? stored.skills : defaultDb.skills;
      stored.skill_groups = Array.isArray(stored.skill_groups) ? stored.skill_groups : defaultDb.skill_groups;
      stored.services = Array.isArray(stored.services) ? stored.services : defaultDb.services;
      stored.experiences = Array.isArray(stored.experiences) ? stored.experiences : [];
      stored.testimonials = Array.isArray(stored.testimonials) ? stored.testimonials : [];
      stored.faqs = Array.isArray(stored.faqs) ? stored.faqs : defaultDb.faqs;
      stored.blog_posts = Array.isArray(stored.blog_posts) ? stored.blog_posts : defaultDb.blog_posts;
      stored.inquiries = Array.isArray(stored.inquiries) ? stored.inquiries : [];
      stored.social_links = Array.isArray(stored.social_links) ? stored.social_links : defaultDb.social_links;
      stored.education = Array.isArray(stored.education) ? stored.education : defaultDb.education;
      stored.certifications = Array.isArray(stored.certifications) ? stored.certifications : [];
      stored.achievements = Array.isArray(stored.achievements) ? stored.achievements : [];
      stored.audit_logs = Array.isArray(stored.audit_logs) ? stored.audit_logs : [];
      stored.intro_video = stored.intro_video || defaultDb.intro_video;

      safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, stored);
    }
    this.db = stored;

    // Trigger non-blocking sync with Supabase so all devices (mobile/desktop) receive cloud data
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        void this.syncWithSupabase();
      }, 0);
    }
  }

  public async syncWithSupabase(): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      try {
        const cloudContent = await loadPortfolioContent();
        this.db = {
          ...this.db,
          ...cloudContent,
          settings: cloudContent.settings
            ? {
                ...this.db.settings,
                ...cloudContent.settings,
                feature_flags: {
                  ...this.db.settings.feature_flags,
                  ...(cloudContent.settings.feature_flags || {}),
                },
              }
            : this.db.settings,
        };
        safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, this.db);
        this.notify();
      } catch (contentError) {
        console.warn('[dataProvider] Shared portfolio content unavailable:', contentError);
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && Array.isArray(data)) {
        const remoteProjects = data
          .map((row: any): Project => ({
            id: String(row.id),
            slug: row.slug || `project-${row.id}`,
            title: row.title || 'Untitled Project',
            summary: row.summary || row.description || '',
            category_id: 'cat-1',
            category_name: row.category || 'Web Development',
            cover_image_url: row.cover_image_url || '/assets/aistudio/Neon_Portfolio_Hero__Welcome__I_m_Ramzan_85351036.png',
            problem: row.description || row.summary || 'Project engineered for high performance.',
            approach: 'Built using modern AI workflows and scalable web technologies.',
            role: 'Creator & Developer',
            process: 'Requirements scoping, iterative component building, testing, and edge deployment.',
            challenges: 'Optimizing performance, responsive layout across all device viewports, and edge caching.',
            results: 'Published and live system.',
            tools: Array.isArray(row.tech_stack) && row.tech_stack.length > 0 ? row.tech_stack : ['Web Development'],
            project_date: row.created_at ? row.created_at.slice(0, 10) : '2026',
            live_url: row.project_url || '',
            source_url: row.repo_url || '',
            featured: Boolean(row.featured),
            status: row.is_published ? 'published' : 'draft',
            sort_order: typeof row.sort_order === 'number' ? row.sort_order : 1,
            view_count: 0,
            is_sample: false,
            gallery: [],
            created_at: row.created_at || new Date().toISOString(),
            updated_at: row.updated_at || new Date().toISOString(),
          }))
          .filter((p) => !this.isTombstoned(p));

        const remoteSlugs = new Set(remoteProjects.map((p) => p.slug.toLowerCase()));
        const remoteTitles = new Set(remoteProjects.map((p) => p.title.toLowerCase()));

        let combined: Project[] = [];
        if (remoteProjects.length > 0) {
          // If remote projects exist, remote projects are the ground truth
          const localOnlyDrafts = this.db.projects.filter(
            (p) =>
              !p.id.includes('-') &&
              !this.isTombstoned(p) &&
              !remoteSlugs.has(p.slug.toLowerCase()) &&
              !remoteTitles.has(p.title.toLowerCase())
          );
          combined = [...remoteProjects, ...localOnlyDrafts];
        } else {
          // If remote is empty, show non-deleted initial projects
          const preservedInitial = INITIAL_PROJECTS.filter(
            (initProj) =>
              !this.isTombstoned(initProj) &&
              !remoteSlugs.has(initProj.slug.toLowerCase()) &&
              !remoteTitles.has(initProj.title.toLowerCase())
          );
          combined = preservedInitial;
        }

        this.db.projects = combined;
        safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, this.db);
        this.notify();
      }
    } catch (err) {
      console.warn('[dataProvider] Error syncing projects from Supabase:', err);
    }
  }

  private persist(action?: { table: string; action: AuditLog['action']; summary: string }) {
    safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, this.db);
    if (action) {
      const logEntry: AuditLog = {
        id: 'log-' + Date.now(),
        at: new Date().toISOString(),
        action: action.action,
        table_name: action.table,
        summary: action.summary,
      };
      this.db.audit_logs.unshift(logEntry);
      safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, this.db);
    }
    this.notify();
    if (action) {
      void syncPortfolioContent(this.db, action.table).catch((error) => {
        console.error('[dataProvider] Portfolio content cloud sync failed:', error);
      });
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getDatabase(): PortfolioDatabase {
    return this.db;
  }

  // Sample counts
  public getSampleCounts(): Record<string, number> {
    const db = this.db || {};
    return {
      projects: (db.projects || []).filter((p) => p?.is_sample).length,
      skills: (db.skills || []).filter((s) => s?.is_sample).length,
      services: (db.services || []).filter((s) => s?.is_sample).length,
      testimonials: (db.testimonials || []).filter((t) => t?.is_sample).length,
      experiences: (db.experiences || []).filter((e) => e?.is_sample).length,
      faqs: (db.faqs || []).filter((f) => f?.is_sample).length,
      blog_posts: (db.blog_posts || []).filter((b) => b?.is_sample).length,
      inquiries: (db.inquiries || []).filter((i) => i?.is_sample).length,
    };
  }

  public getTotalSampleCount(): number {
    const counts = this.getSampleCounts();
    return Object.values(counts).reduce((acc, curr) => acc + curr, 0);
  }

  // Purge sample data (type-to-confirm in admin)
  public purgeSampleData(): void {
    this.db.projects = this.db.projects.filter((p) => !p.is_sample);
    this.db.skills = this.db.skills.filter((s) => !s.is_sample);
    this.db.services = this.db.services.filter((s) => !s.is_sample);
    this.db.testimonials = this.db.testimonials.filter((t) => !t.is_sample);
    this.db.experiences = this.db.experiences.filter((e) => !e.is_sample);
    this.db.faqs = this.db.faqs.filter((f) => !f.is_sample);
    this.db.blog_posts = this.db.blog_posts.filter((b) => !b.is_sample);
    this.db.inquiries = this.db.inquiries.filter((i) => !i.is_sample);
    this.db.social_links = this.db.social_links.filter((s) => !s.is_sample);
    this.db.profile.is_sample = false;
    this.db.intro_video.is_sample = false;

    this.persist({
      table: 'all',
      action: 'delete',
      summary: 'Purged all sample items from the database',
    });
  }

  // Reset to initial demo data
  public resetToSampleData(): void {
    this.db = getDefaultDatabase();
    this.persist({
      table: 'all',
      action: 'import',
      summary: 'Reset database to bundled sample data',
    });
  }

  // Profile & Settings
  public updateProfile(profile: Partial<Profile>): void {
    this.db.profile = { ...this.db.profile, ...profile, updated_at: new Date().toISOString() };
    this.persist({
      table: 'profile',
      action: 'update',
      summary: 'Updated profile information',
    });
  }

  public updateSettings(settings: Partial<SiteSettings>): void {
    this.db.settings = { ...this.db.settings, ...settings, updated_at: new Date().toISOString() };
    this.persist({
      table: 'site_settings',
      action: 'update',
      summary: 'Updated site settings & configuration',
    });
  }

  public updateIntroVideo(intro: Partial<IntroVideoSettings>): void {
    this.db.intro_video = { ...this.db.intro_video, ...intro, updated_at: new Date().toISOString() };
    this.persist({
      table: 'intro_video',
      action: 'update',
      summary: 'Updated AI intro video settings',
    });
  }

  // Projects
  public async addProject(
    project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'view_count'>
  ): Promise<{ success: boolean; error?: string; project: Project }> {
    // Generate unique slug
    let safeSlug = (project.slug || project.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (!safeSlug) safeSlug = `project-${Date.now()}`;

    const existingSlugs = this.db.projects.map((p) => p.slug.toLowerCase());
    if (existingSlugs.includes(safeSlug)) {
      safeSlug = `${safeSlug}-${Date.now().toString().slice(-4)}`;
    }

    const tempId = 'proj-' + Date.now();
    const newProj: Project = {
      ...project,
      slug: safeSlug,
      id: tempId,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Pre-insert into local cache for immediate feedback
    this.db.projects.unshift(newProj);
    this.persist({
      table: 'projects',
      action: 'insert',
      summary: `Created project: "${newProj.title}"`,
    });

    if (isSupabaseConfigured) {
      await ensureAdminSession();
      try {
        const fullDescription = (newProj.problem || newProj.summary || '').trim();
        const safeSummary = (newProj.summary && newProj.summary.length <= 490)
          ? newProj.summary
          : fullDescription.slice(0, 487) + (fullDescription.length > 487 ? '...' : '');

        const supabaseRow = {
          title: newProj.title,
          slug: newProj.slug,
          summary: safeSummary || 'Project engineered for high performance.',
          description: fullDescription || safeSummary,
          cover_image_url: newProj.cover_image_url,
          category: newProj.category_name || 'Web Development',
          featured: newProj.featured,
          is_published: newProj.status !== 'draft',
          sort_order: newProj.sort_order || 1,
          project_url: newProj.live_url || '',
          repo_url: newProj.source_url || '',
          tech_stack: Array.isArray(newProj.tools) ? newProj.tools : ['Web Development'],
        };

        const { data, error } = await supabase
          .from('projects')
          .insert([supabaseRow])
          .select()
          .single();

        if (error) {
          console.error('[dataProvider] Supabase project insert error:', error);
          return { success: false, error: error.message, project: newProj };
        }

        if (data) {
          newProj.id = String(data.id);
          safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, this.db);
          this.notify();
        }
      } catch (err: any) {
        console.error('[dataProvider] Supabase insert failed:', err);
        return { success: false, error: err?.message || 'Network error saving to cloud', project: newProj };
      }
    }

    return { success: true, project: newProj };
  }

  public async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<{ success: boolean; error?: string }> {
    this.db.projects = this.db.projects.map((p) =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    this.persist({
      table: 'projects',
      action: 'update',
      summary: `Updated project ID: ${id}`,
    });

    if (isSupabaseConfigured) {
      await ensureAdminSession();
      try {
        const target = this.db.projects.find((p) => p.id === id);
        if (target) {
          const supabaseRow: any = {
            updated_at: new Date().toISOString(),
          };
          if (updates.title !== undefined) supabaseRow.title = updates.title;
          if (updates.slug !== undefined) supabaseRow.slug = updates.slug;
          if (updates.summary !== undefined || updates.problem !== undefined) {
            const fullDescription = (updates.problem ?? updates.summary ?? target.problem ?? target.summary ?? '').trim();
            const safeSummary = (updates.summary && updates.summary.length <= 490)
              ? updates.summary
              : fullDescription.slice(0, 487) + (fullDescription.length > 487 ? '...' : '');
            supabaseRow.summary = safeSummary || 'Project engineered for high performance.';
            supabaseRow.description = fullDescription || safeSummary;
          }
          if (updates.cover_image_url !== undefined) supabaseRow.cover_image_url = updates.cover_image_url;
          if (updates.category_name !== undefined) supabaseRow.category = updates.category_name;
          if (updates.featured !== undefined) supabaseRow.featured = updates.featured;
          if (updates.status !== undefined) supabaseRow.is_published = updates.status === 'published';
          if (updates.sort_order !== undefined) supabaseRow.sort_order = updates.sort_order;
          if (updates.live_url !== undefined) supabaseRow.project_url = updates.live_url;
          if (updates.source_url !== undefined) supabaseRow.repo_url = updates.source_url;
          if (updates.tools !== undefined) supabaseRow.tech_stack = updates.tools;

          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
          let error: any = null;
          if (isUuid) {
            const res = await supabase
              .from('projects')
              .update(supabaseRow)
              .eq('id', id);
            error = res.error;
          } else if (target.slug) {
            const res = await supabase
              .from('projects')
              .update(supabaseRow)
              .eq('slug', target.slug);
            error = res.error;
          }

          if (error) {
            console.error('[dataProvider] Supabase project update error:', error);
            return { success: false, error: error.message };
          }
        }
      } catch (err: any) {
        console.error('[dataProvider] Supabase update failed:', err);
        return { success: false, error: err?.message || 'Network error updating project' };
      }
    }

    return { success: true };
  }

  public async deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
    const target = this.db.projects.find((p) => p.id === id);
    const targetSlug = target?.slug?.toLowerCase().trim();
    const targetTitle = target?.title?.toLowerCase().trim();

    // 1. Add to permanent tombstone list so this project NEVER resurrects on sync or reload
    this.addDeletedTombstone(id, targetSlug, targetTitle);

    // 2. Remove immediately from local state
    this.db.projects = this.db.projects.filter(
      (p) => p.id !== id && (!targetSlug || p.slug.toLowerCase().trim() !== targetSlug)
    );
    this.persist({
      table: 'projects',
      action: 'delete',
      summary: `Deleted project: "${target?.title || id}"`,
    });
    this.notify();

    // 3. Remove from Supabase cloud database if configured
    if (isSupabaseConfigured) {
      await ensureAdminSession();
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (isUuid) {
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

          if (error) {
            console.error('[dataProvider] Supabase project delete error by ID:', error);
            return { success: false, error: error.message };
          }
        } else if (targetSlug) {
          // If not UUID, delete from remote by slug if exists
          const { error } = await supabase
            .from('projects')
            .delete()
            .eq('slug', targetSlug);

          if (error) {
            console.warn('[dataProvider] Supabase delete by slug warning:', error);
          }
        }
      } catch (err: any) {
        console.error('[dataProvider] Supabase delete failed:', err);
        return { success: false, error: err?.message || 'Network error deleting project' };
      }
    }

    return { success: true };
  }

  public incrementProjectView(slug: string): void {
    const proj = this.db.projects.find((p) => p.slug === slug);
    if (proj) {
      proj.view_count += 1;
      safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, this.db);
    }
  }

  // Skills
  public addSkill(skill: Omit<Skill, 'id'>): void {
    const newSkill: Skill = { ...skill, id: 'sk-' + Date.now() };
    this.db.skills.push(newSkill);
    this.persist({
      table: 'skills',
      action: 'insert',
      summary: `Added skill: ${newSkill.name}`,
    });
  }

  public updateSkill(id: string, updates: Partial<Skill>): void {
    this.db.skills = this.db.skills.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.persist({
      table: 'skills',
      action: 'update',
      summary: `Updated skill ID: ${id}`,
    });
  }

  public deleteSkill(id: string): void {
    this.db.skills = this.db.skills.filter((s) => s.id !== id);
    this.persist({
      table: 'skills',
      action: 'delete',
      summary: `Deleted skill ID: ${id}`,
    });
  }

  // Services
  public addService(service: Omit<Service, 'id'>): void {
    const newSrv: Service = { ...service, id: 'srv-' + Date.now() };
    this.db.services.push(newSrv);
    this.persist({
      table: 'services',
      action: 'insert',
      summary: `Added service: ${newSrv.name}`,
    });
  }

  public updateService(id: string, updates: Partial<Service>): void {
    this.db.services = this.db.services.map((s) => (s.id === id ? { ...s, ...updates } : s));
    this.persist({
      table: 'services',
      action: 'update',
      summary: `Updated service ID: ${id}`,
    });
  }

  public deleteService(id: string): void {
    this.db.services = this.db.services.filter((s) => s.id !== id);
    this.persist({
      table: 'services',
      action: 'delete',
      summary: `Deleted service ID: ${id}`,
    });
  }

  // Testimonials
  public addTestimonial(t: Omit<Testimonial, 'id'>): void {
    const newTest: Testimonial = { ...t, id: 'test-' + Date.now() };
    this.db.testimonials.push(newTest);
    this.persist({
      table: 'testimonials',
      action: 'insert',
      summary: `Added testimonial from: ${newTest.author_name}`,
    });
  }

  public updateTestimonial(id: string, updates: Partial<Testimonial>): void {
    this.db.testimonials = this.db.testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t));
    this.persist({
      table: 'testimonials',
      action: 'update',
      summary: `Updated testimonial ID: ${id}`,
    });
  }

  public deleteTestimonial(id: string): void {
    this.db.testimonials = this.db.testimonials.filter((t) => t.id !== id);
    this.persist({
      table: 'testimonials',
      action: 'delete',
      summary: `Deleted testimonial ID: ${id}`,
    });
  }

  // Experience
  public addExperience(exp: Omit<Experience, 'id'>): void {
    const newExp: Experience = { ...exp, id: 'exp-' + Date.now() };
    this.db.experiences.unshift(newExp);
    this.persist({
      table: 'experiences',
      action: 'insert',
      summary: `Added experience: ${newExp.role} at ${newExp.organization}`,
    });
  }

  public updateExperience(id: string, updates: Partial<Experience>): void {
    this.db.experiences = this.db.experiences.map((e) => (e.id === id ? { ...e, ...updates } : e));
    this.persist({
      table: 'experiences',
      action: 'update',
      summary: `Updated experience ID: ${id}`,
    });
  }

  public deleteExperience(id: string): void {
    this.db.experiences = this.db.experiences.filter((e) => e.id !== id);
    this.persist({
      table: 'experiences',
      action: 'delete',
      summary: `Deleted experience ID: ${id}`,
    });
  }

  // FAQs
  public addFaq(faq: Omit<FAQ, 'id'>): void {
    const newFaq: FAQ = { ...faq, id: 'faq-' + Date.now() };
    this.db.faqs.push(newFaq);
    this.persist({
      table: 'faqs',
      action: 'insert',
      summary: `Added FAQ: ${newFaq.question.slice(0, 30)}...`,
    });
  }

  public updateFaq(id: string, updates: Partial<FAQ>): void {
    this.db.faqs = this.db.faqs.map((f) => (f.id === id ? { ...f, ...updates } : f));
    this.persist({
      table: 'faqs',
      action: 'update',
      summary: `Updated FAQ ID: ${id}`,
    });
  }

  public deleteFaq(id: string): void {
    this.db.faqs = this.db.faqs.filter((f) => f.id !== id);
    this.persist({
      table: 'faqs',
      action: 'delete',
      summary: `Deleted FAQ ID: ${id}`,
    });
  }

  // Inquiries
  public submitInquiry(input: Omit<Inquiry, 'id' | 'created_at' | 'status' | 'notify_status' | 'is_sample'>): {
    ok: boolean;
    id?: string;
    message?: string;
  } {
    const newInquiry: Inquiry = {
      ...input,
      id: 'inq-' + Date.now(),
      status: 'new',
      notify_status: 'sent',
      is_sample: false,
      created_at: new Date().toISOString(),
    };
    this.db.inquiries.unshift(newInquiry);
    this.persist({
      table: 'inquiries',
      action: 'insert',
      summary: `New inquiry received from ${newInquiry.name} (${newInquiry.email})`,
    });

    this.trackEvent({
      event: 'form_submit',
      label: input.service || 'General contact',
      session_id: 'client-session',
      device: window.innerWidth < 768 ? 'mobile' : 'desktop',
    });

    return {
      ok: true,
      id: newInquiry.id,
      message: this.db.settings.contact_success_message,
    };
  }

  public updateInquiryStatus(id: string, status: Inquiry['status']): void {
    this.db.inquiries = this.db.inquiries.map((i) =>
      i.id === id ? { ...i, status, read_at: i.read_at || new Date().toISOString() } : i
    );
    this.persist({
      table: 'inquiries',
      action: 'update',
      summary: `Changed inquiry status to ${status} for ID: ${id}`,
    });
  }

  public addInquiryNote(id: string, note: string): void {
    this.db.inquiries = this.db.inquiries.map((i) => {
      if (i.id === id) {
        const notes = i.notes || [];
        return {
          ...i,
          notes: [
            ...notes,
            {
              id: 'note-' + Date.now(),
              note,
              created_at: new Date().toISOString(),
              author: 'Admin',
            },
          ],
        };
      }
      return i;
    });
    this.persist({
      table: 'inquiries',
      action: 'update',
      summary: `Added note to inquiry ID: ${id}`,
    });
  }

  public deleteInquiry(id: string): void {
    this.db.inquiries = this.db.inquiries.filter((i) => i.id !== id);
    this.persist({
      table: 'inquiries',
      action: 'delete',
      summary: `Deleted inquiry ID: ${id}`,
    });
  }

  // Analytics
  public trackEvent(event: Omit<AnalyticsEvent, 'id' | 'occurred_at'>): void {
    if (!this.db.settings.feature_flags.analytics_enabled) return;
    const newEvent: AnalyticsEvent = {
      ...event,
      id: 'evt-' + Date.now(),
      occurred_at: new Date().toISOString(),
    };
    this.db.analytics_events.push(newEvent);
    if (this.db.analytics_events.length > 500) {
      this.db.analytics_events = this.db.analytics_events.slice(-500);
    }
    safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, this.db);
  }

  // Launch readiness checklist calculation (Backend Schema §14)
  public getLaunchReadiness() {
    const profileDone = !this.db.profile.is_sample && Boolean(this.db.profile.full_name);
    const emailDone = this.db.settings.contact_email !== 'hello@example.com' && Boolean(this.db.settings.contact_email);
    const publishedProjects = this.db.projects.filter((p) => p.status === 'published' && !p.is_sample);
    const projectsDone = publishedProjects.length >= 3;
    const introDone = !this.db.settings.feature_flags.intro_enabled || (!this.db.intro_video.is_sample && Boolean(this.db.intro_video.video_desktop_url));
    const testimonialsDone = this.db.testimonials.filter((t) => t.approval === 'approved' && !t.is_sample).length >= 1;
    const sampleItemsRemaining = this.getTotalSampleCount();

    const items = [
      { label: 'Profile Information & Bio Configured', complete: profileDone, target: '/admin/settings' },
      { label: 'Production Contact Email Configured', complete: emailDone, target: '/admin/settings' },
      { label: 'At Least 3 Real Published Projects', complete: projectsDone, target: '/admin/projects' },
      { label: 'AI Intro Video Configured or Disabled', complete: introDone, target: '/admin/intro' },
      { label: 'Testimonials Approved or Replaced', complete: testimonialsDone, target: '/admin/testimonials' },
      { label: `All Sample Content Replaced (${sampleItemsRemaining} sample rows remaining)`, complete: sampleItemsRemaining === 0, target: '/admin/sample-data' },
    ];

    const completedCount = items.filter((i) => i.complete).length;
    const score = Math.round((completedCount / items.length) * 100);

    return {
      items,
      score,
      isReady: score === 100,
    };
  }
}

export const dataProvider = new DataProviderService();
