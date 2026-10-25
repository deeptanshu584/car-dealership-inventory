import { closeSync, existsSync, mkdirSync, openSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';

export function ensureSqliteFile(databaseUrl) {
  if (!databaseUrl?.startsWith('file:'))
    throw new Error('DATABASE_URL must be a SQLite file: URL');
  const rawPath = databaseUrl.slice(5);
  const filePath = isAbsolute(rawPath)
    ? rawPath
    : resolve(process.cwd(), 'prisma', rawPath);
  mkdirSync(dirname(filePath), { recursive: true });
  if (!existsSync(filePath)) closeSync(openSync(filePath, 'a'));
}
