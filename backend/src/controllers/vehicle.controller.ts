import type { RequestHandler } from 'express';
import type { VehicleService } from '../services/VehicleService';

export function vehicleController(vehicles: VehicleService): { create: RequestHandler } {
  return { create: (request, response, next) => {
    vehicles.create(request.body).then(vehicle => response.status(201).json(vehicle)).catch(next);
  } };
}
