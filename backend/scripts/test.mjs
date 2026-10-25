import { execFileSync } from 'node:child_process';
import { ensureSqliteFile } from './sqlite.mjs';

process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-only-secret';
ensureSqliteFile(process.env.DATABASE_URL);
const runner = process.platform === 'win32' ? 'npx.cmd' : 'npx';
execFileSync(runner, ['prisma', 'migrate', 'deploy'], {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});
execFileSync(runner, ['jest', '--runInBand', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});
