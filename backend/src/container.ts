import { PrismaClient } from '@prisma/client';
import { loadEnv } from './config/env';
import { PrismaUserRepository } from './repositories/PrismaUserRepository';
import { PrismaVehicleRepository } from './repositories/PrismaVehicleRepository';
import { AuthService } from './services/AuthService';
import { VehicleService } from './services/VehicleService';

export function createContainer() {
  const env = loadEnv();
  const prisma = new PrismaClient();
  const users = new PrismaUserRepository(prisma);
  const vehicles = new PrismaVehicleRepository(prisma);
  return {
    prisma,
    auth: new AuthService(users, env.jwtSecret),
    vehicles: new VehicleService(vehicles),
    env,
  };
}
