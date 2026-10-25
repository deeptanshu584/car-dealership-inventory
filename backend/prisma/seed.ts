import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from '../src/repositories/PrismaUserRepository';
import { PrismaVehicleRepository } from '../src/repositories/PrismaVehicleRepository';
import type { IUserRepository } from '../src/repositories/IUserRepository';
import type { IVehicleRepository, CreateVehicleRecord } from '../src/repositories/IVehicleRepository';

export async function seedAdmin(users: IUserRepository, emailInput: string, password: string): Promise<void> {
  const email = emailInput.trim().toLowerCase();
  if (await users.findByEmail(email)) return;
  await users.create({ name: 'Administrator', email, passwordHash: await bcrypt.hash(password, 10), role: 'ADMIN' });
}

const sampleVehicles: CreateVehicleRecord[] = [
  { make: 'Toyota', model: 'Camry', category: 'SEDAN', priceCents: 2499900, quantity: 5 },
  { make: 'Honda', model: 'CR-V', category: 'SUV', priceCents: 3195000, quantity: 3 },
  { make: 'Tesla', model: 'Model 3', category: 'ELECTRIC', priceCents: 3899000, quantity: 0 },
  { make: 'Ford', model: 'Mustang', category: 'COUPE', priceCents: 4290000, quantity: 2 },
  { make: 'Volkswagen', model: 'Golf', category: 'HATCHBACK', priceCents: 2199900, quantity: 7 },
];

export async function seedVehicles(vehicles: IVehicleRepository): Promise<void> {
  if ((await vehicles.list(1, 1)).total > 0) return;
  for (const vehicle of sampleVehicles) await vehicles.create(vehicle);
}

if (require.main === module) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  const prisma = new PrismaClient();
  (async () => {
    await seedAdmin(new PrismaUserRepository(prisma), email, password);
    await seedVehicles(new PrismaVehicleRepository(prisma));
  })().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
}
