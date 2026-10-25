import request from 'supertest';
import { createApp } from '../../src/app';

it('returns the standard 404 error shape for unknown routes', async () => {
  const response = await request(createApp()).get('/api/no-such-route');
  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
});
