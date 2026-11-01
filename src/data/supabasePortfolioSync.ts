import { supabase } from '../lib/supabase';
import type { PortfolioDatabase } from './dataProvider';

type Row = Record<string, unknown>;
const rows = (items: unknown[]): Row[] => items as Row[];
const singleton = (item: Record<string, unknown>, id = 1) => ({ ...item, id });

/**
 * Best-effort persistence bridge. Writes the current portfolio snapshot to the
 * portfolio_* tables; existing public tables and Local Storage fallback remain intact.
 */
export async function syncPortfolioDatabase(db: PortfolioDatabase): Promise<void> {
  const writes: Array<[string, Row[]]> = [
    ['portfolio_profile', [singleton(db.profile as unknown as Row)]],
    ['portfolio_settings', [singleton(db.settings as unknown as Row)]],
    ['portfolio_social_links', rows(db.social_links)],
    ['portfolio_nav_items', rows(db.nav_items)],
    ['portfolio_home_sections', rows(db.home_sections)],
    ['portfolio_intro_video', [singleton(db.intro_video as unknown as Row)]],
    ['portfolio_categories', rows(db.categories)],
    ['portfolio_tags', rows(db.tags)],
    ['portfolio_projects', db.projects.map(p => ({ ...p, gallery: p.gallery ?? [] })) as unknown as Row[]],
    ['portfolio_skill_groups', rows(db.skill_groups)],
    ['portfolio_skills', rows(db.skills)],
    ['portfolio_experiences', rows(db.experiences)],
    ['portfolio_education', rows(db.education)],
    ['portfolio_certifications', rows(db.certifications)],
    ['portfolio_achievements', rows(db.achievements)],
    ['portfolio_services', db.services.map(({ packages, ...service }) => service) as unknown as Row[]],
    ['portfolio_service_packages', db.services.flatMap(s => s.packages ?? []) as unknown as Row[]],
    ['portfolio_faqs', rows(db.faqs)],
    ['portfolio_testimonials', rows(db.testimonials)],
    ['portfolio_blog_posts', rows(db.blog_posts)],
    ['portfolio_inquiries', db.inquiries.map(({ notes, ...inquiry }) => inquiry) as unknown as Row[]],
    ['portfolio_inquiry_notes', db.inquiries.flatMap(i => (i.notes ?? []).map(n => ({ ...n, inquiry_id: i.id }))) as unknown as Row[]],
    ['portfolio_analytics_events', rows(db.analytics_events)],
    ['portfolio_audit_logs', db.audit_logs.map(log => ({ ...log, at: log.at })) as unknown as Row[]],
  ];

  const results = await Promise.all(writes.map(async ([table, data]) => {
    if (!data.length) return null;
    const { error } = await supabase.from(table).upsert(data);
    if (error) throw new Error(`Supabase sync failed for ${table}: ${error.message}`);
    return table;
  }));
  const failed = results.filter(Boolean);
  if (failed.length) console.info('Portfolio data synced to Supabase:', failed.length, 'tables');
}
