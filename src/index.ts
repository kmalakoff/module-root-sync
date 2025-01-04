import fs from 'fs';
import path from 'path';

import type { RootOptions } from './types';

const existsSync = (test) => {
  try {
    (fs.accessSync || fs.statSync)(test);
    return true;
  } catch (_) {
    return false;
  }
};

export * from './types';
export default function moduleRoot(dir: string, options?: RootOptions): string {
  const packagePath = path.join(dir, 'package.json');

  if (existsSync(packagePath)) {
    if (!options || options.keyExists === undefined) return dir;
    if (JSON.parse(fs.readFileSync(packagePath, 'utf8'))[options.keyExists] !== undefined) return dir;
  }

  const nextDir = path.dirname(dir);
  if (nextDir === dir) throw new Error('Root not found');
  return moduleRoot(nextDir, options);
}
