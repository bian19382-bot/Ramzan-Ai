#!/usr/bin/env node
import fs from 'node:fs';

const lockfiles = ['bun.lock', 'bun.lockb', 'yarn.lock', 'pnpm-lock.yaml'];

for (const file of lockfiles) {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`[clean-lockfiles] Removed ${file} to ensure clean npm build.`);
    }
  } catch (err) {
    // Silent ignore if permission issue
  }
}
