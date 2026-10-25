import 'dotenv/config';
import { execFileSync } from 'node:child_process';
import { ensureSqliteFile } from './sqlite.mjs';

ensureSqliteFile(process.env.DATABASE_URL);
const runner = process.platform === 'win32' ? 'npx.cmd' : 'npx';
execFileSync(runner, ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});
