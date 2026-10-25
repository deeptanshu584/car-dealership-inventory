import jwt from 'jsonwebtoken';
import { AuthService } from '../../src/services/AuthService';
import type {
  IUserRepository,
  UserRecord,
} from '../../src/repositories/IUserRepository';

class FakeUsers implements IUserRepository {
  rows: UserRecord[] = [];
  async findByEmail(email: string) {
    return this.rows.find((user) => user.email === email) ?? null;
  }
  async create(data: Omit<UserRecord, 'id' | 'createdAt'>) {
    const user = {
      ...data,
      id: String(this.rows.length + 1),
      createdAt: new Date(),
    };
    this.rows.push(user);
    return user;
  }
}

const secret = 'test-secret';

it('registers a normal user with a lowercase email and no password hash in response', async () => {
  const users = new FakeUsers();
  const result = await new AuthService(users, secret).register({
    name: 'Ada',
    email: 'Ada@Example.com',
    password: 'secure123',
  });
  expect(result.user).toMatchObject({
    name: 'Ada',
    email: 'ada@example.com',
    role: 'USER',
  });
  expect(result.user).not.toHaveProperty('passwordHash');
  expect(jwt.verify(result.token, secret)).toMatchObject({
    sub: '1',
    role: 'USER',
  });
  expect(users.rows[0].passwordHash).not.toBe('secure123');
});

it('rejects a duplicate email regardless of case', async () => {
  const users = new FakeUsers();
  const auth = new AuthService(users, secret);
  await auth.register({
    name: 'Ada',
    email: 'Ada@Example.com',
    password: 'secure123',
  });
  await expect(
    auth.register({
      name: 'Other',
      email: 'ADA@example.com',
      password: 'secure123',
    }),
  ).rejects.toMatchObject({ status: 409 });
});

it('returns the same message for an unknown email and wrong password', async () => {
  const auth = new AuthService(new FakeUsers(), secret);
  const missing = auth.login({ email: 'nobody@example.com', password: 'nope' });
  await expect(missing).rejects.toMatchObject({
    status: 401,
    message: 'Invalid credentials',
  });
});
