import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const email = `register-${Date.now()}@example.com`;

it('registers a user and hides the password hash', async () => {
  const response = await request(app).post('/api/auth/register').send({ name: 'Ada', email, password: 'secure123', role: 'ADMIN' });
  expect(response.status).toBe(201);
  expect(response.body.user).toMatchObject({ email, role: 'USER' });
  expect(response.body.user).not.toHaveProperty('passwordHash');
  expect(typeof response.body.token).toBe('string');
});

it('rejects weak registration passwords', async () => {
  const response = await request(app).post('/api/auth/register').send({ name: 'Ada', email: 'weak@example.com', password: 'short' });
  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
});

it('logs in with registered credentials', async () => {
  const response = await request(app).post('/api/auth/login').send({ email, password: 'secure123' });
  expect(response.status).toBe(200);
  expect(response.body.user.email).toBe(email);
});
