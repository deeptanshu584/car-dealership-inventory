import express from 'express';
import request from 'supertest';
import { AppError } from '../../src/errors/AppError';
import { errorHandler } from '../../src/middleware/errorHandler';

function appFor(error: Error) {
  const app = express();
  app.get('/fail', () => { throw error; });
  app.use(errorHandler);
  return app;
}

it('maps known errors to their public status and shape', async () => {
  const response = await request(appFor(new AppError(400, 'VALIDATION_ERROR', 'Bad input', ['name']))).get('/fail');
  expect(response.status).toBe(400);
  expect(response.body).toEqual({ error: { code: 'VALIDATION_ERROR', message: 'Bad input', details: ['name'] } });
});

it('hides unexpected error internals', async () => {
  const response = await request(appFor(new Error('database password leaked'))).get('/fail');
  expect(response.status).toBe(500);
  expect(response.body).toEqual({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
});
