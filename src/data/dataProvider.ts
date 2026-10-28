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

class DataProviderService {
  private db: PortfolioDatabase;
  private listeners: Set<() => void> = new Set();

  constructor() {
    let stored = safeStorage.getJSON<PortfolioDatabase | null>(STORAGE_KEYS.DEMO_DATA, null);
    if (!stored || (stored.profile?.full_name !== 'Ramzan' && stored.profile?.full_name !== 'Ramzan Ghafoor')) {
      stored = getDefaultDatabase();
      safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, stored);
    } else {
      // Synchronize confirmed real profile & contact details
      stored.profile.full_name = 'Ramzan';
      stored.profile.professional_title = 'AI Creator & Digital Professional';
      stored.profile.value_proposition = INITIAL_PROFILE.value_proposition;
      stored.profile.bio_short = INITIAL_PROFILE.bio_short;
      stored.profile.bio_long = INITIAL_PROFILE.bio_long;
      stored.profile.portrait_url = INITIAL_PROFILE.portrait_url;
      stored.profile.welcome_banner_url = INITIAL_PROFILE.welcome_banner_url;
      stored.profile.roles_rotating = INITIAL_PROFILE.roles_rotating;
      stored.profile.values = INITIAL_PROFILE.values;

      stored.settings.site_name = 'Ramzan';
      stored.settings.tagline = 'AI Creator & Digital Professional';
      stored.settings.contact_email = 'babajani543210@gmail.com';
      stored.settings.whatsapp_number = '03271126457';
      stored.settings.availability_text = 'Open to suitable opportunities';
      stored.settings.contact_success_message = 'Thanks for reaching out. Your message has been submitted successfully.';
      
      if (stored.settings.feature_flags) {
        stored.settings.feature_flags.testimonials_enabled = false;
        stored.settings.feature_flags.intro_enabled = false;
        stored.settings.feature_flags.welcome_banner_enabled = true;
        stored.settings.feature_flags.pricing_enabled = false;
      }

      stored.skills = INITIAL_SKILLS;
      stored.services = INITIAL_SERVICES;
      stored.faqs = INITIAL_FAQS;
      stored.social_links = INITIAL_SOCIAL_LINKS;
      stored.education = INITIAL_EDUCATION;
      stored.experiences = [];
      stored.testimonials = [];

      // Strictly preserve existing projects
      if (!stored.projects) {
        stored.projects = [];
      }

      safeStorage.setJSON(STORAGE_KEYS.DEMO_DATA, stored);
    }
    this.db = stored;
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
    return {
      projects: this.db.projects.filter((p) => p.is_sample).length,
      skills: this.db.skills.filter((s) => s.is_sample).length,
      services: this.db.services.filter((s) => s.is_sample).length,
      testimonials: this.db.testimonials.filter((t) => t.is_sample).length,
      experiences: this.db.experiences.filter((e) => e.is_sample).length,
      faqs: this.db.faqs.filter((f) => f.is_sample).length,
      blog_posts: this.db.blog_posts.filter((b) => b.is_sample).length,
      inquiries: this.db.inquiries.filter((i) => i.is_sample).length,
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
  public addProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Project {
    const newProj: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.db.projects.unshift(newProj);
    this.persist({
      table: 'projects',
      action: 'insert',
      summary: `Created project: "${newProj.title}"`,
    });
    return newProj;
  }

  public updateProject(id: string, updates: Partial<Project>): void {
    this.db.projects = this.db.projects.map((p) =>
      p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
    );
    this.persist({
      table: 'projects',
      action: 'update',
      summary: `Updated project ID: ${id}`,
    });
  }

  public deleteProject(id: string): void {
    const target = this.db.projects.find((p) => p.id === id);
    this.db.projects = this.db.projects.filter((p) => p.id !== id);
    this.persist({
      table: 'projects',
      action: 'delete',
      summary: `Deleted project: "${target?.title || id}"`,
    });
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
