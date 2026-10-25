import express, { type Express } from 'express';

export function createApp(): Express {
  const app = express();
  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.use((_request, response) => {
    response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
  });
  return app;
}
