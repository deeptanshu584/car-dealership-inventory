import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const user = jwt.sign({ role: 'USER' }, 'test-only-secret', {
  subject: 'user-1',
});
const admin = jwt.sign({ role: 'ADMIN' }, 'test-only-secret', {
  subject: 'admin-1',
});

it('allows only admins to delete a vehicle', async () => {
  const created = await request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${user}`)
    .send({
      make: 'Mazda',
      model: '3',
      category: 'SEDAN',
      price: 8000,
      quantity: 1,
    });
  const url = `/api/vehicles/${created.body.id}`;
  expect(
    (await request(app).delete(url).set('Authorization', `Bearer ${user}`))
      .status,
  ).toBe(403);
  expect(
    (await request(app).delete(url).set('Authorization', `Bearer ${admin}`))
      .status,
  ).toBe(204);
  expect(
    (await request(app).delete(url).set('Authorization', `Bearer ${admin}`))
      .status,
  ).toBe(404);
});
