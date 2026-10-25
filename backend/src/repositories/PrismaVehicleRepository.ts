import type { Prisma, PrismaClient } from '@prisma/client';
import type { CreateVehicleRecord, IVehicleRepository, VehiclePage, VehicleRecord, VehicleSearchCriteria, UpdateVehicleRecord } from './IVehicleRepository';

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
  async search(criteria: VehicleSearchCriteria): Promise<VehiclePage> {
    const where: Prisma.VehicleWhereInput = {
      ...(criteria.make ? { make: { contains: criteria.make } } : {}),
      ...(criteria.model ? { model: { contains: criteria.model } } : {}),
      ...(criteria.category ? { category: criteria.category } : {}),
      ...(criteria.minPrice !== undefined || criteria.maxPrice !== undefined ? { priceCents: { ...(criteria.minPrice !== undefined ? { gte: Math.round(criteria.minPrice * 100) } : {}), ...(criteria.maxPrice !== undefined ? { lte: Math.round(criteria.maxPrice * 100) } : {}) } } : {}),
    };
    const [total, data] = await this.prisma.$transaction([
      this.prisma.vehicle.count({ where }),
      this.prisma.vehicle.findMany({ where, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], skip: (criteria.page - 1) * criteria.limit, take: criteria.limit }),
    ]);
    return { total, data };
  }
  findById(id: string): Promise<VehicleRecord | null> {
    return this.prisma.vehicle.findUnique({ where: { id } });
  }
  update(id: string, data: UpdateVehicleRecord): Promise<VehicleRecord> {
    return this.prisma.vehicle.update({ where: { id }, data });
  }
  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.delete({ where: { id } });
  }
}
