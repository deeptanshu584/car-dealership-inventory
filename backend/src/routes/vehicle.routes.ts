import { Router } from 'express';
import { vehicleController } from '../controllers/vehicle.controller';
import { authenticate } from '../middleware/authenticate';
import { validateBody } from '../middleware/validate';
import { vehicleCreateSchema } from '../schemas/vehicle.schemas';
import type { VehicleService } from '../services/VehicleService';

export function vehicleRoutes(vehicles: VehicleService, secret: string): Router {
  const router = Router();
  const controller = vehicleController(vehicles);
  router.use(authenticate(secret));
  router.post('/', validateBody(vehicleCreateSchema), controller.create);
  return router;
}
