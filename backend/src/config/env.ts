export interface Env {
  jwtSecret: string;
  databaseUrl: string;
  port: number;
  corsOrigin: string;
}

export function loadEnv(
  source: Record<string, string | undefined> = process.env,
): Env {
  if (!source.JWT_SECRET) throw new Error('JWT_SECRET is required');
  if (!source.DATABASE_URL) throw new Error('DATABASE_URL is required');
  return {
    jwtSecret: source.JWT_SECRET,
    databaseUrl: source.DATABASE_URL,
    port: Number(source.PORT ?? 4000),
    corsOrigin: source.CORS_ORIGIN ?? 'http://localhost:5173',
  };
}
