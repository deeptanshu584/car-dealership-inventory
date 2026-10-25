import request from 'supertest';
import { createApp } from '../../src/app';

it('allows the configured frontend origin and sets security headers', async () => {
  const app = createApp();
  const response = await request(app)
    .options('/api/vehicles')
    .set('Origin', 'http://localhost:5173')
    .set('Access-Control-Request-Method', 'GET');
  expect(response.headers['access-control-allow-origin']).toBe(
    'http://localhost:5173',
  );
  const health = await request(app).get('/api/health');
  expect(health.headers['x-content-type-options']).toBe('nosniff');
});

it('rate limits repeated auth attempts', async () => {
  const app = createApp();
  const statuses = [];
  for (let index = 0; index < 6; index++) {
    statuses.push(
      (
        await request(app)
          .post('/api/auth/login')
          .send({ email: 'nobody@example.com', password: 'wrong' })
      ).status,
    );
  }
  expect(statuses[5]).toBe(429);
});
