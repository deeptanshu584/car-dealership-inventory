import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createContainer } from './container';
import { AppError, NotFoundError } from './errors/AppError';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth.routes';
import { vehicleRoutes } from './routes/vehicle.routes';

export function createApp(): Express {
  const app = express();
  const container = createContainer();
  app.use(helmet());
  app.use(cors({ origin: container.env.corsOrigin }));
  app.use(express.json({ limit: '100kb' }));
  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok' });
  });
  app.use(
    '/api/auth',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 5,
      handler: (_request, _response, next) =>
        next(new AppError(429, 'RATE_LIMITED', 'Too many requests')),
    }),
    authRoutes(container.auth),
  );
  app.use(
    '/api/vehicles',
    vehicleRoutes(container.vehicles, container.env.jwtSecret),
  );
  app.use((_request, _response, next) =>
    next(new NotFoundError('Route not found')),
  );
  app.use(errorHandler);
  return app;
}
