export interface FeatureFlags {
  intro_enabled: boolean;
  welcome_banner_enabled: boolean;
  testimonials_enabled: boolean;
  faq_enabled: boolean;
  pricing_enabled: boolean;
  blog_enabled: boolean;
  command_palette_enabled: boolean;
  language_switcher_enabled: boolean;
  analytics_enabled: boolean;
  three_d_hero_enabled: boolean;
  custom_cursor_enabled: boolean;
  scroll_progress_enabled: boolean;
  hide_on_scroll_nav: boolean;
  sample_banner_enabled: boolean;
  ai_consultant_enabled: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  intro_enabled: false,
  welcome_banner_enabled: true,
  testimonials_enabled: true,
  faq_enabled: true,
  pricing_enabled: true,
  blog_enabled: true,
  command_palette_enabled: true,
  language_switcher_enabled: true,
  analytics_enabled: true,
  three_d_hero_enabled: false,
  custom_cursor_enabled: false,
  scroll_progress_enabled: true,
  hide_on_scroll_nav: false,
  sample_banner_enabled: true,
  ai_consultant_enabled: true,
};
