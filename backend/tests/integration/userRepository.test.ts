import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../../src/repositories/PrismaUserRepository';

const prisma = new PrismaClient();
const repo = new PrismaUserRepository(prisma);

afterAll(async () => {
  await prisma.$disconnect();
});

it('stores and retrieves users in the SQLite database', async () => {
  const email = `user-${Date.now()}@example.com`;
  const created = await repo.create({
    name: 'Ada',
    email,
    passwordHash: 'hash',
    role: 'USER',
  });
  expect(created.id).toBeTruthy();
  expect(await repo.findByEmail(email)).toMatchObject({
    id: created.id,
    email,
    role: 'USER',
  });
});
