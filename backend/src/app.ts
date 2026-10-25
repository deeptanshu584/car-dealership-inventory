import express, { type Express } from 'express';
import { createContainer } from './container';
import { NotFoundError } from './errors/AppError';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth.routes';
import { vehicleRoutes } from './routes/vehicle.routes';

export function createApp(): Express {
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  const container = createContainer();
  app.use('/api/auth', authRoutes(container.auth));
  app.use('/api/vehicles', vehicleRoutes(container.vehicles, container.env.jwtSecret));
  app.use((_request, _response, next) => next(new NotFoundError('Route not found')));
  app.use(errorHandler);
  return app;
}
