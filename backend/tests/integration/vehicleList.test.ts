import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const token = jwt.sign({ role: 'USER' }, 'test-only-secret', {
  subject: 'user-1',
});
const auth = { Authorization: `Bearer ${token}` };

it('lists vehicles including out-of-stock rows with pagination', async () => {
  const created = await request(app).post('/api/vehicles').set(auth).send({
    make: 'Honda',
    model: 'Civic',
    category: 'SEDAN',
    price: 10000,
    quantity: 0,
  });
  const response = await request(app)
    .get('/api/vehicles?page=1&limit=100')
    .set(auth);
  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({ page: 1, limit: 100 });
  expect(response.body.total).toBeGreaterThanOrEqual(1);
  expect(response.body.data).toContainEqual(
    expect.objectContaining({ id: created.body.id, quantity: 0 }),
  );
  const single = await request(app).get('/api/vehicles?limit=1').set(auth);
  expect(single.body.data).toHaveLength(1);
});
