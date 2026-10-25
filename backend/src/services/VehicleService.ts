import { ConflictError, NotFoundError } from '../errors/AppError';
import type {
  IVehicleRepository,
  VehicleRecord,
  VehicleSearchCriteria,
} from '../repositories/IVehicleRepository';

export interface VehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export function toVehicleDto(vehicle: VehicleRecord) {
  return {
    id: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    category: vehicle.category,
    price: vehicle.priceCents / 100,
    quantity: vehicle.quantity,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
}

export class VehicleService {
  constructor(private readonly vehicles: IVehicleRepository) {}
  async create(input: VehicleInput) {
    const vehicle = await this.vehicles.create({
      make: input.make,
      model: input.model,
      category: input.category,
      priceCents: Math.round(input.price * 100),
      quantity: input.quantity,
    });
    return toVehicleDto(vehicle);
  }
  async list(page: number, limit: number) {
    const result = await this.vehicles.list(page, limit);
    return {
      data: result.data.map(toVehicleDto),
      page,
      limit,
      total: result.total,
    };
  }
  async search(criteria: VehicleSearchCriteria) {
    const result = await this.vehicles.search(criteria);
    return {
      data: result.data.map(toVehicleDto),
      page: criteria.page,
      limit: criteria.limit,
      total: result.total,
    };
  }
  async update(id: string, input: Partial<VehicleInput>) {
    if (!(await this.vehicles.findById(id)))
      throw new NotFoundError('Vehicle not found');
    const { price, ...rest } = input;
    const vehicle = await this.vehicles.update(id, {
      ...rest,
      ...(price === undefined ? {} : { priceCents: Math.round(price * 100) }),
    });
    return toVehicleDto(vehicle);
  }
  async delete(id: string): Promise<void> {
    if (!(await this.vehicles.findById(id)))
      throw new NotFoundError('Vehicle not found');
    await this.vehicles.delete(id);
  }
  async purchase(id: string, quantity: number) {
    const succeeded = await this.vehicles.decrementIfAvailable(id, quantity);
    if (!succeeded) {
      if (!(await this.vehicles.findById(id)))
        throw new NotFoundError('Vehicle not found');
      throw new ConflictError('Insufficient stock');
    }
    const vehicle = await this.vehicles.findById(id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');
    return toVehicleDto(vehicle);
  }
  async restock(id: string, quantity: number) {
    if (!(await this.vehicles.findById(id)))
      throw new NotFoundError('Vehicle not found');
    return toVehicleDto(await this.vehicles.increment(id, quantity));
  }
}
