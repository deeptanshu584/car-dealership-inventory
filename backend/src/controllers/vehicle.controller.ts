import type { RequestHandler } from 'express';
import type { VehicleService } from '../services/VehicleService';

export function vehicleController(vehicles: VehicleService): { create: RequestHandler; list: RequestHandler; search: RequestHandler } {
  return {
    create: (request, response, next) => {
      vehicles.create(request.body).then(vehicle => response.status(201).json(vehicle)).catch(next);
    },
    list: (_request, response, next) => {
      const { page, limit } = response.locals.query as { page: number; limit: number };
      vehicles.list(page, limit).then(result => response.json(result)).catch(next);
    },
    search: (_request, response, next) => {
      vehicles.search(response.locals.query).then(result => response.json(result)).catch(next);
    },
  };
}
