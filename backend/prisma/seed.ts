import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../src/repositories/PrismaUserRepository';
import type { IUserRepository } from '../src/repositories/IUserRepository';

export async function seedAdmin(users: IUserRepository, emailInput: string, password: string): Promise<void> {
  const email = emailInput.trim().toLowerCase();
  if (await users.findByEmail(email)) return;
  await users.create({ name: 'Administrator', email, passwordHash: await bcrypt.hash(password, 10), role: 'ADMIN' });
}

if (require.main === module) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  const prisma = new PrismaClient();
  seedAdmin(new PrismaUserRepository(prisma), email, password)
    .finally(() => prisma.$disconnect());
}
