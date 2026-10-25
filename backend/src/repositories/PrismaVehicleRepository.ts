import type { PrismaClient } from '@prisma/client';
import type { CreateVehicleRecord, IVehicleRepository, VehicleRecord } from './IVehicleRepository';

export class PrismaVehicleRepository implements IVehicleRepository {
  constructor(private readonly prisma: PrismaClient) {}
  create(data: CreateVehicleRecord): Promise<VehicleRecord> {
    return this.prisma.vehicle.create({ data });
  }
}
