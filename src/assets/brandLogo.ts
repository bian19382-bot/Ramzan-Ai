// Centralized Brand Logo asset imported directly as a Vite module.
// Vite hashes and bundles this image directly into the production output,
// guaranteeing that it loads cleanly on Cloudflare Pages and all hosting environments.
import logoAsset from './brand/ramzan-logo.png';

export const BRAND_LOGO_URL = logoAsset;
export const BRAND_LOGO_FALLBACK = '/logo.png';
