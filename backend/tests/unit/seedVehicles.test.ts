import { seedVehicles } from '../../prisma/seed';
import type { IVehicleRepository, CreateVehicleRecord } from '../../src/repositories/IVehicleRepository';

it('seeds sample vehicles only when inventory is empty', async () => {
  const created: CreateVehicleRecord[] = [];
  const vehicles = { list: async () => ({ data: [], total: created.length }), create: async (data: CreateVehicleRecord) => { created.push(data); return data; } } as unknown as IVehicleRepository;
  await seedVehicles(vehicles);
  const count = created.length;
  await seedVehicles(vehicles);
  expect(count).toBeGreaterThanOrEqual(3);
  expect(created).toHaveLength(count);
});
