import type { IVehicleRepository, VehicleRecord } from '../repositories/IVehicleRepository';

export interface VehicleInput { make: string; model: string; category: string; price: number; quantity: number; }

export function toVehicleDto(vehicle: VehicleRecord) {
  return { id: vehicle.id, make: vehicle.make, model: vehicle.model, category: vehicle.category, price: vehicle.priceCents / 100, quantity: vehicle.quantity, createdAt: vehicle.createdAt, updatedAt: vehicle.updatedAt };
}

export class VehicleService {
  constructor(private readonly vehicles: IVehicleRepository) {}
  async create(input: VehicleInput) {
    const vehicle = await this.vehicles.create({ make: input.make, model: input.model, category: input.category, priceCents: Math.round(input.price * 100), quantity: input.quantity });
    return toVehicleDto(vehicle);
  }
  async list(page: number, limit: number) {
    const result = await this.vehicles.list(page, limit);
    return { data: result.data.map(toVehicleDto), page, limit, total: result.total };
  }
}
