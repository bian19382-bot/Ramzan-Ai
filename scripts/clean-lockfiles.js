#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const lockfiles = ['bun.lock', 'bun.lockb', 'yarn.lock', 'pnpm-lock.yaml'];

// Clean root lockfiles
for (const file of lockfiles) {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`[clean-lockfiles] Removed ${file} to ensure clean npm build.`);
    }
  } catch (err) {
    // Silent ignore
  }
}

// Clean in public/ or dist/ if accidentally placed
['public', 'dist', 'src'].forEach((dir) => {
  for (const file of lockfiles) {
    const fullPath = path.join(dir, file);
    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`[clean-lockfiles] Removed ${fullPath}`);
      }
    } catch (err) {}
  }
});
