import express from 'express';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { authenticate } from '../../src/middleware/authenticate';
import { requireRole } from '../../src/middleware/requireRole';
import { errorHandler } from '../../src/middleware/errorHandler';

const secret = 'test-secret';
const app = express();
app.get('/protected', authenticate(secret), (_request, response) => response.json({ ok: true }));
app.get('/admin', authenticate(secret), requireRole('ADMIN'), (_request, response) => response.json({ ok: true }));
app.use(errorHandler);

it('rejects missing, invalid, and expired tokens', async () => {
  for (const token of [undefined, 'bad-token', jwt.sign({ role: 'USER' }, secret, { subject: '1', expiresIn: -1 })]) {
    const response = await request(app).get('/protected').set(token ? { Authorization: `Bearer ${token}` } : {});
    expect(response.status).toBe(401);
  }
});

it('accepts a valid token and limits admin routes to admins', async () => {
  const user = jwt.sign({ role: 'USER' }, secret, { subject: '1' });
  const admin = jwt.sign({ role: 'ADMIN' }, secret, { subject: '2' });
  expect((await request(app).get('/protected').set('Authorization', `Bearer ${user}`)).status).toBe(200);
  expect((await request(app).get('/admin').set('Authorization', `Bearer ${user}`)).status).toBe(403);
  expect((await request(app).get('/admin').set('Authorization', `Bearer ${admin}`)).status).toBe(200);
});
