import { FeatureFlags } from '../config/flags';

export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type InquiryStatus = 'new' | 'in_progress' | 'replied' | 'closed' | 'spam';
export type ThemeMode = 'system' | 'dark' | 'light';
export type AccentPalette = 'violet' | 'blue';

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline: string;
  contact_email: string;
  whatsapp_number: string;
  booking_url: string;
  availability_enabled: boolean;
  availability_text: string;
  default_theme: ThemeMode;
  accent_palette: AccentPalette;
  contact_success_message: string;
  inquiry_retention_days: number;
  analytics_retention_days: number;
  feature_flags: FeatureFlags;
  updated_at: string;
}

export interface ProfileValue {
  title: string;
  text: string;
  icon: string;
}

export interface Profile {
  id: number;
  full_name: string;
  professional_title: string;
  value_proposition: string;
  bio_short: string;
  bio_long: string;
  portrait_url: string;
  welcome_banner_url: string;
  roles_rotating: string[];
  values: ProfileValue[];
  languages_complete: string[];
  is_sample: boolean;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: 'github' | 'linkedin' | 'x' | 'instagram' | 'youtube' | 'email' | 'whatsapp' | 'other';
  label: string;
  url: string;
  show_in_hero: boolean;
  show_in_footer: boolean;
  sort_order: number;
  is_sample: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  target: string;
  is_cta: boolean;
  visible: boolean;
  sort_order: number;
}

export interface HomeSection {
  key: string;
  title: string;
  eyebrow: string;
  visible: boolean;
  sort_order: number;
}

export interface IntroVideoSettings {
  id: number;
  enabled: boolean;
  video_desktop_url: string;
  video_mobile_url: string;
  poster_url: string;
  captions_url: string;
  focal_x: number;
  focal_y: number;
  end_color: string;
  load_timeout_seconds: number;
  autoplay_muted: boolean;
  script_en: string;
  script_ur: string;
  show_name_overlay: boolean;
  is_sample: boolean;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_sample: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  is_sample: boolean;
}

export interface ProjectMedia {
  id: string;
  url: string;
  caption: string;
  alt_text: string;
  sort_order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category_id: string;
  category_name?: string;
  cover_image_url: string;
  demo_video_url?: string;
  problem: string;
  approach: string;
  role: string;
  process: string;
  challenges: string;
  results: string;
  tools: string[];
  project_date: string;
  live_url?: string;
  source_url?: string;
  featured: boolean;
  status: ContentStatus;
  publish_at?: string;
  seo_title?: string;
  seo_description?: string;
  sort_order: number;
  view_count: number;
  is_sample: boolean;
  gallery: ProjectMedia[];
  created_at: string;
  updated_at: string;
}

export interface SkillGroup {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  is_sample: boolean;
}

export interface Skill {
  id: string;
  group_id: string;
  group_name?: string;
  name: string;
  context: string;
  is_tool: boolean;
  logo_icon: string;
  visible: boolean;
  sort_order: number;
  is_sample: boolean;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  highlights: string[];
  visible: boolean;
  sort_order: number;
  is_sample: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year?: number;
  notes: string;
  visible: boolean;
  sort_order: number;
  is_sample: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issued_on: string;
  credential_url?: string;
  visible: boolean;
  sort_order: number;
  is_sample: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number;
  metric_value?: number;
  metric_label?: string;
  proof_url?: string;
  visible: boolean;
  sort_order: number;
  is_sample: boolean;
}

export interface ServicePackage {
  id: string;
  service_id: string;
  name: string;
  price_text: string;
  description: string;
  features: string[];
  recommended: boolean;
  sort_order: number;
  is_sample: boolean;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  icon: string;
  problem_solved: string;
  description: string;
  deliverables: string[];
  process_steps: string[];
  starting_price?: string;
  timeline_note?: string;
  related_project_ids: string[];
  visible: boolean;
  sort_order: number;
  is_sample: boolean;
  packages?: ServicePackage[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  service_id?: string;
  visible: boolean;
  sort_order: number;
  is_sample: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_company: string;
  photo_url?: string;
  permission_confirmed: boolean;
  approval: 'pending' | 'approved' | 'hidden';
  project_id?: string;
  sort_order: number;
  is_sample: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category_name: string;
  cover_image_url: string;
  tags: string[];
  reading_minutes: number;
  status: ContentStatus;
  publish_at?: string;
  seo_title?: string;
  seo_description?: string;
  is_sample: boolean;
  created_at: string;
  updated_at: string;
}

export interface InquiryNote {
  id: string;
  note: string;
  created_at: string;
  author: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  service?: string;
  budget?: string;
  timeline?: string;
  message: string;
  project_slug?: string;
  status: InquiryStatus;
  notify_status: 'pending' | 'sent' | 'failed' | 'skipped';
  consent: boolean;
  is_sample: boolean;
  created_at: string;
  read_at?: string;
  notes?: InquiryNote[];
}

export interface AnalyticsEvent {
  id: string;
  occurred_at: string;
  event: 'page_view' | 'project_view' | 'cta_click' | 'form_start' | 'form_submit' | 'intro_play' | 'intro_skip' | 'intro_complete';
  path?: string;
  project_slug?: string;
  label?: string;
  referrer_host?: string;
  session_id: string;
  device: 'mobile' | 'tablet' | 'desktop';
}

export interface AuditLog {
  id: string;
  at: string;
  action: 'insert' | 'update' | 'delete' | 'login' | 'export' | 'import';
  table_name: string;
  summary: string;
}
