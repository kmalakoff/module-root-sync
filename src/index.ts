import fs from 'fs';
import path from 'path';

const existsSync = (test: string): boolean => {
  try {
    (fs.accessSync || fs.statSync)(test);
    return true;
  } catch (_) {
    return false;
  }
};

import type { PathLike } from './types.ts';

/**
 * Convert file:// URL to filesystem path
 * Node 0.8 compatible (no url.fileURLToPath available)
 * Accepts string paths, string file URLs, or URL objects
 */
const fileURLToPath = (input: PathLike): string => {
  // Handle URL objects by extracting href
  const urlString = typeof input === 'string' ? input : input.href;

  // Check if it's a file URL (use indexOf for Node 0.8 compat)
  if (urlString.indexOf('file://') !== 0) {
    return urlString; // Not a file URL, return as-is
  }

  // Remove file:// prefix
  let filepath = urlString.slice(7);

  // Handle Windows: file:///C:/path -> C:/path
  if (filepath.charAt(0) === '/' && filepath.charAt(2) === ':') {
    filepath = filepath.slice(1);
  }

  // Decode URL-encoded characters (%20 -> space, etc.)
  filepath = decodeURIComponent(filepath);

  return filepath;
};

import type { RootOptions } from './types.ts';

export * from './types.ts';
export default function moduleRoot(dir: PathLike, options: RootOptions = {}) {
  const name = options.name === undefined ? 'package.json' : options.name;

  // Convert file:// URL to path if needed
  let current = fileURLToPath(dir);
  do {
    const packagePath = path.join(current, name);
    if (existsSync(packagePath)) {
      if (!options.keyExists) return current;
      if (JSON.parse(fs.readFileSync(packagePath, 'utf8'))[options.keyExists] !== undefined) return current;
    }
    const next = path.dirname(current);
    if (next === current) break;
    current = next;
  } while (current);
  throw new Error('Root not found');
}
