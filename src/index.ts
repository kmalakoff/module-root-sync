import fs from 'fs';
import path from 'path';
import existsSync from 'fs-exists-sync';

export default function moduleRoot(dir: string): string {
  const packagePath = path.join(dir, 'package.json');
  if (existsSync(packagePath) && JSON.parse(fs.readFileSync(packagePath, 'utf8')).name) return dir;
  const nextDir = path.dirname(dir);
  if (nextDir === dir) throw new Error('Package root not found');
  return moduleRoot(nextDir);
}
