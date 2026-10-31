#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Ensures that both 'dist' and 'build' directories exist with identical production assets.
// This prevents Cloudflare Pages build errors if the user configures the output directory as either 'dist' or 'build'.
try {
  if (fs.existsSync('dist')) {
    fs.cpSync('dist', 'build', { recursive: true });
    console.log('[prepare-output] Successfully mirrored dist/ to build/ for Cloudflare compatibility.');
  }
} catch (err) {
  console.warn('[prepare-output] Warning while mirroring dist to build:', err);
}
