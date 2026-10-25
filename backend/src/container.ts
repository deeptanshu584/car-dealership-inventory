import { PrismaClient } from '@prisma/client';
import { loadEnv } from './config/env';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { AuthService } from './services/AuthService';

export function createContainer() {
  const env = loadEnv();
  const prisma = new PrismaClient();
  const users = new PrismaUserRepository(prisma);
  return { prisma, auth: new AuthService(users, env.jwtSecret), env };
}
