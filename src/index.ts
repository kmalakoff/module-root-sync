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

import type { RootOptions } from './types.ts';

export * from './types.ts';
export default function moduleRoot(dir: string, options: RootOptions = {}) {
  const name = options.name === undefined ? 'package.json' : options.name;

  let current = dir;
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
