import { execFileSync } from 'node:child_process';
import { closeSync, openSync } from 'node:fs';

process.env.DATABASE_URL = 'file:./test.db';
closeSync(openSync(new URL('../prisma/test.db', import.meta.url), 'a'));
const runner = process.platform === 'win32' ? 'npx.cmd' : 'npx';
execFileSync(runner, ['prisma', 'migrate', 'deploy'], { stdio: 'inherit', env: process.env, shell: process.platform === 'win32' });
execFileSync(runner, ['jest', '--runInBand', ...process.argv.slice(2)], { stdio: 'inherit', env: process.env, shell: process.platform === 'win32' });
