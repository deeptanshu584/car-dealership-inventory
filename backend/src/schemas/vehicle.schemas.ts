import { z } from 'zod';

export const categories = ['SEDAN', 'SUV', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'TRUCK', 'VAN', 'ELECTRIC'] as const;
export const vehicleCreateSchema = z.object({
  make: z.string().trim().min(1),
  model: z.string().trim().min(1),
  category: z.enum(categories),
  price: z.number().positive().refine(price => Math.abs(Math.round(price * 100) / 100 - price) < 1e-9, 'Maximum two decimal places'),
  quantity: z.number().int().nonnegative(),
});
export const listQuerySchema = z.object({ page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().positive().max(100).default(12) });
