import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/authenticate';
import { validateBody } from '../middleware/validate';
import { validateQuery } from '../middleware/validateQuery';
import { listQuerySchema, searchQuerySchema, vehicleCreateSchema, vehicleUpdateSchema } from '../schemas/vehicle.schemas';
import type { VehicleService } from '../services/VehicleService';

export function vehicleRoutes(vehicles: VehicleService, secret: string): Router {
  const router = Router();
  const controller = vehicleController(vehicles);
  router.use(authenticate(secret));
  router.post('/', validateBody(vehicleCreateSchema), controller.create);
  router.get('/search', validateQuery(searchQuerySchema), controller.search);
  router.get('/', validateQuery(listQuerySchema), controller.list);
  router.put('/:id', validateBody(vehicleUpdateSchema), controller.update);
  return router;
}
