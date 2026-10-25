import { seedAdmin } from '../../prisma/seed';
import type { IUserRepository, UserRecord } from '../../src/repositories/IUserRepository';

it('creates the configured admin once', async () => {
  const rows: UserRecord[] = [];
  const users: IUserRepository = {
    findByEmail: async email => rows.find(row => row.email === email) ?? null,
    create: async data => { const row = { ...data, id: '1', createdAt: new Date() }; rows.push(row); return row; },
  };
  await seedAdmin(users, 'ADMIN@Example.com', 'secure123');
  await seedAdmin(users, 'ADMIN@Example.com', 'secure123');
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ email: 'admin@example.com', role: 'ADMIN' });
  expect(rows[0].passwordHash).not.toBe('secure123');
});
