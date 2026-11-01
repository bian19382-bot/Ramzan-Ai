#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Ensures physical HTML files for client-side routes (/admin, /login, /resume)
// so that direct browser navigation, hard refreshes, and trailing slashes
// NEVER return a 404 on Cloudflare Pages or any static edge CDN.
try {
  if (fs.existsSync('dist')) {
    const routes = ['admin', 'login', 'resume'];

    routes.forEach((route) => {
      const routeDir = path.join('dist', route);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.copyFileSync(path.join('dist', 'index.html'), path.join(routeDir, 'index.html'));
      fs.copyFileSync(path.join('dist', 'index.html'), path.join('dist', `${route}.html`));
    });

    // Mirror everything to 'build' directory as well
    fs.cpSync('dist', 'build', { recursive: true });
    console.log('[prepare-output] Successfully created physical route fallbacks and mirrored dist/ to build/.');
  }
} catch (err) {
  console.warn('[prepare-output] Warning while preparing output:', err);
}
