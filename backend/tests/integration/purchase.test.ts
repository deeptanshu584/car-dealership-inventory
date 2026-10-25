import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const token = jwt.sign({ role: 'USER' }, 'test-only-secret', {
  subject: 'user-1',
});
const auth = { Authorization: `Bearer ${token}` };

it('atomically allows only one purchase of the final unit', async () => {
  const created = await request(app).post('/api/vehicles').set(auth).send({
    make: 'Kia',
    model: 'Rio',
    category: 'SEDAN',
    price: 9000,
    quantity: 1,
  });
  const url = `/api/vehicles/${created.body.id}/purchase`;
  const results = await Promise.all([
    request(app).post(url).set(auth).send({}),
    request(app).post(url).set(auth).send({}),
  ]);
  expect(results.map((result) => result.status).sort()).toEqual([200, 409]);
  expect(results.find((result) => result.status === 200)?.body.quantity).toBe(
    0,
  );
});

it('rejects invalid purchase quantities', async () => {
  const response = await request(app)
    .post('/api/vehicles/unknown/purchase')
    .set(auth)
    .send({ quantity: 0 });
  expect(response.status).toBe(400);
});
