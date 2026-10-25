import express, { type Express } from 'express';
import { NotFoundError } from './errors/AppError';
import { errorHandler } from './middleware/errorHandler';

export function createApp(): Express {
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.use((_request, _response, next) => next(new NotFoundError('Route not found')));
  app.use(errorHandler);
  return app;
}
