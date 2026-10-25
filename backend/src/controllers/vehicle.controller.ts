import type { RequestHandler } from 'express';
import type { VehicleService } from '../services/VehicleService';

export function vehicleController(vehicles: VehicleService): { create: RequestHandler; list: RequestHandler; search: RequestHandler; update: RequestHandler; delete: RequestHandler; purchase: RequestHandler; restock: RequestHandler } {
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
    update: (request, response, next) => {
      vehicles.update(request.params.id, request.body).then(vehicle => response.json(vehicle)).catch(next);
    },
    delete: (request, response, next) => {
      vehicles.delete(request.params.id).then(() => response.status(204).send()).catch(next);
    },
    purchase: (request, response, next) => {
      vehicles.purchase(request.params.id, request.body.quantity).then(vehicle => response.json(vehicle)).catch(next);
    },
    restock: (request, response, next) => {
      vehicles.restock(request.params.id, request.body.quantity).then(vehicle => response.json(vehicle)).catch(next);
    },
  };
}
