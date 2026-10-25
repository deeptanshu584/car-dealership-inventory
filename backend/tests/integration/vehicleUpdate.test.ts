import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const token = jwt.sign({ role: 'USER' }, 'test-only-secret', {
  subject: 'user-1',
});
const auth = { Authorization: `Bearer ${token}` };

it('partially updates a vehicle', async () => {
  const created = await request(app).post('/api/vehicles').set(auth).send({
    make: 'Ford',
    model: 'Focus',
    category: 'HATCHBACK',
    price: 5000,
    quantity: 1,
  });
  const response = await request(app)
    .put(`/api/vehicles/${created.body.id}`)
    .set(auth)
    .send({ price: 5500.25 });
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    id: created.body.id,
    make: 'Ford',
    price: 5500.25,
  });
});

it('rejects empty updates and unknown ids', async () => {
  expect(
    (
      await request(app)
        .put('/api/vehicles/unknown')
        .set(auth)
        .send({ make: 'Other' })
    ).status,
  ).toBe(404);
  expect(
    (await request(app).put('/api/vehicles/unknown').set(auth).send({})).status,
  ).toBe(400);
});
