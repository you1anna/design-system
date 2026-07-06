import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

if (!existsSync(resolve(here, '..', 'node_modules'))) {
  console.error('Dependencies not installed — run `npm run bootstrap` (or `npm ci`) first.');
  process.exit(1);
}
