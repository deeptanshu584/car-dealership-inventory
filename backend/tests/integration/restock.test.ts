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

it('allows only admins to restock', async () => {
  const created = await request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${user}`)
    .send({
      make: 'Nissan',
      model: 'Leaf',
      category: 'ELECTRIC',
      price: 12000,
      quantity: 0,
    });
  const url = `/api/vehicles/${created.body.id}/restock`;
  expect(
    (
      await request(app)
        .post(url)
        .set('Authorization', `Bearer ${user}`)
        .send({ quantity: 2 })
    ).status,
  ).toBe(403);
  const response = await request(app)
    .post(url)
    .set('Authorization', `Bearer ${admin}`)
    .send({ quantity: 2 });
  expect(response.status).toBe(200);
  expect(response.body.quantity).toBe(2);
});
