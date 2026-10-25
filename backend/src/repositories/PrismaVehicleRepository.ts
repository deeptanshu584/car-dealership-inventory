import type { PrismaClient } from '@prisma/client';
import type { CreateVehicleRecord, IVehicleRepository, VehiclePage, VehicleRecord } from './IVehicleRepository';

export class PrismaVehicleRepository implements IVehicleRepository {
  constructor(private readonly prisma: PrismaClient) {}
  create(data: CreateVehicleRecord): Promise<VehicleRecord> {
    return this.prisma.vehicle.create({ data });
  }
  async list(page: number, limit: number): Promise<VehiclePage> {
    const [total, data] = await this.prisma.$transaction([
      this.prisma.vehicle.count(),
      this.prisma.vehicle.findMany({ orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (page - 1) * limit, take: limit }),
    ]);
    return { total, data };
  }
}
