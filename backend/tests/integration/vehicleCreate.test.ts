import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../../src/app';

const app = createApp();
const token = jwt.sign({ role: 'USER' }, 'test-only-secret', {
  subject: 'user-1',
});

it('creates a vehicle with decimal price and no admin requirement', async () => {
  const response = await request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${token}`)
    .send({
      make: 'Toyota',
      model: 'Camry',
      category: 'SEDAN',
      price: 19999.99,
      quantity: 2,
    });
  expect(response.status).toBe(201);
  expect(response.body).toMatchObject({
    make: 'Toyota',
    model: 'Camry',
    category: 'SEDAN',
    price: 19999.99,
    quantity: 2,
  });
  expect(response.body.id).toBeTruthy();
});

it('rejects unauthenticated and invalid vehicle creation', async () => {
  expect((await request(app).post('/api/vehicles').send({})).status).toBe(401);
  const invalid = await request(app)
    .post('/api/vehicles')
    .set('Authorization', `Bearer ${token}`)
    .send({
      make: 'Toyota',
      model: 'Camry',
      category: 'SEDAN',
      price: -1,
      quantity: 1.5,
    });
  expect(invalid.status).toBe(400);
});
