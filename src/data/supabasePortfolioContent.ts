import { supabase } from '../lib/supabase';
import type { PortfolioDatabase } from './dataProvider';

type PortfolioContentTable =
  | 'profile'
  | 'site_settings'
  | 'intro_video'
  | 'categories'
  | 'tags'
  | 'skills'
  | 'services'
  | 'all';

type DbRow = Record<string, unknown>;

const singleton = (value: object, id = 1): DbRow => ({ ...value, id });

/**
 * Read shared CMS content for public visitors and admin sessions.
 * Projects intentionally remain in the existing project repository/table;
 * this bridge only handles the portfolio content tables.
 */
export async function loadPortfolioContent(): Promise<Partial<PortfolioDatabase>> {
  const tableNames = [
    'portfolio_profile',
    'portfolio_settings',
    'portfolio_social_links',
    'portfolio_nav_items',
    'portfolio_home_sections',
    'portfolio_intro_video',
    'portfolio_categories',
    'portfolio_tags',
    'portfolio_skill_groups',
    'portfolio_skills',
    'portfolio_services',
  ] as const;

  const results = await Promise.all(
    tableNames.map(async (table) => {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw new Error(`Unable to load ${table}: ${error.message}`);
      return [table, data ?? []] as const;
    })
  );

  const rows = Object.fromEntries(results) as Record<(typeof tableNames)[number], DbRow[]>;
  const profile = rows.portfolio_profile[0];
  const settings = rows.portfolio_settings[0];
  const intro = rows.portfolio_intro_video[0];

  return {
    ...(profile ? { profile: profile as unknown as PortfolioDatabase['profile'] } : {}),
    ...(settings
      ? { settings: settings as unknown as PortfolioDatabase['settings'] }
      : {}),
    ...(rows.portfolio_social_links.length
      ? { social_links: rows.portfolio_social_links as unknown as PortfolioDatabase['social_links'] }
      : {}),
    ...(rows.portfolio_nav_items.length
      ? { nav_items: rows.portfolio_nav_items as unknown as PortfolioDatabase['nav_items'] }
      : {}),
    ...(rows.portfolio_home_sections.length
      ? { home_sections: rows.portfolio_home_sections as unknown as PortfolioDatabase['home_sections'] }
      : {}),
    ...(intro ? { intro_video: intro as unknown as PortfolioDatabase['intro_video'] } : {}),
    ...(rows.portfolio_categories.length
      ? { categories: rows.portfolio_categories as unknown as PortfolioDatabase['categories'] }
      : {}),
    ...(rows.portfolio_tags.length
      ? { tags: rows.portfolio_tags as unknown as PortfolioDatabase['tags'] }
      : {}),
    ...(rows.portfolio_skill_groups.length
      ? { skill_groups: rows.portfolio_skill_groups as unknown as PortfolioDatabase['skill_groups'] }
      : {}),
    ...(rows.portfolio_skills.length
      ? { skills: rows.portfolio_skills as unknown as PortfolioDatabase['skills'] }
      : {}),
    ...(rows.portfolio_services.length
      ? { services: rows.portfolio_services as unknown as PortfolioDatabase['services'] }
      : {}),
  };
}

/**
 * Persist only the content area changed by an admin action. This avoids
 * uploading a stale Local Storage snapshot over newer cloud data.
 */
export async function syncPortfolioContent(
  db: PortfolioDatabase,
  changedTable?: string
): Promise<void> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session?.user) return;

  const all = !changedTable || changedTable === 'all';
  const writes: Array<[string, DbRow[]]> = [];

  if (all || changedTable === 'profile') {
    writes.push(['portfolio_profile', [singleton(db.profile)]]);
  }
  if (all || changedTable === 'site_settings') {
    writes.push(['portfolio_settings', [singleton(db.settings)]]);
  }
  if (all || changedTable === 'intro_video') {
    writes.push(['portfolio_intro_video', [singleton(db.intro_video)]]);
  }
  if (all || changedTable === 'categories') {
    writes.push(['portfolio_categories', db.categories as unknown as DbRow[]]);
  }
  if (all || changedTable === 'tags') {
    writes.push(['portfolio_tags', db.tags as unknown as DbRow[]]);
  }
  if (all || changedTable === 'skills') {
    writes.push(['portfolio_skill_groups', db.skill_groups as unknown as DbRow[]]);
    writes.push(['portfolio_skills', db.skills as unknown as DbRow[]]);
  }
  if (all || changedTable === 'services') {
    writes.push([
      'portfolio_services',
      db.services.map(({ packages: _packages, ...service }) => service) as unknown as DbRow[],
    ]);
  }
  if (all) {
    writes.push(['portfolio_social_links', db.social_links as unknown as DbRow[]]);
    writes.push(['portfolio_nav_items', db.nav_items as unknown as DbRow[]]);
    writes.push(['portfolio_home_sections', db.home_sections as unknown as DbRow[]]);
  }

  for (const [table, data] of writes) {
    if (!data.length) continue;
    const { error } = await supabase.from(table).upsert(data);
    if (error) throw new Error(`Unable to save ${table}: ${error.message}`);
  }
}
