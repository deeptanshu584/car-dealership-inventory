import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const token = jwt.sign({ role: 'USER' }, 'test-only-secret', { subject: 'user-1' });
const auth = { Authorization: `Bearer ${token}` };

it('searches make case-insensitively with inclusive price bounds', async () => {
  const make = `SearchMake${Date.now()}`;
  const created = await request(app).post('/api/vehicles').set(auth).send({ make, model: 'One', category: 'SUV', price: 15000, quantity: 1 });
  const response = await request(app).get(`/api/vehicles/search?make=${make.toLowerCase()}&minPrice=15000&maxPrice=15000`).set(auth);
  expect(response.status).toBe(200);
  expect(response.body.data).toContainEqual(expect.objectContaining({ id: created.body.id }));
});

it('rejects inverted price ranges', async () => {
  const response = await request(app).get('/api/vehicles/search?minPrice=200&maxPrice=100').set(auth);
  expect(response.status).toBe(400);
});
