import fs from 'fs';
import path from 'path';
const existsSync = (test) => {
  try {
    (fs.accessSync || fs.statSync)(test);
    return true;
  } catch (_) {
    return false;
  }
};
export * from './types';
export default function moduleRoot(dir, options) {
  let current = dir;
  do {
    const packagePath = path.join(current, 'package.json');
    if (existsSync(packagePath)) {
      if (!options || options.keyExists === undefined) return current;
      if (JSON.parse(fs.readFileSync(packagePath, 'utf8'))[options.keyExists] !== undefined) return current;
    }
    const next = path.dirname(current);
    if (next === current) break;
    current = next;
  } while (current);
  throw new Error('Root not found');
}
