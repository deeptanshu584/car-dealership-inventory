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
export const searchQuerySchema = listQuerySchema.extend({
  make: z.string().trim().optional(),
  model: z.string().trim().optional(),
  category: z.preprocess(value => typeof value === 'string' ? value.toUpperCase() : value, z.enum(categories).optional()),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
}).refine(query => query.minPrice === undefined || query.maxPrice === undefined || query.minPrice <= query.maxPrice, 'minPrice must be at most maxPrice');
export const vehicleUpdateSchema = vehicleCreateSchema.partial().refine(value => Object.keys(value).length > 0, 'At least one field is required');
export const purchaseSchema = z.object({ quantity: z.number().int().positive().default(1) });
export const restockSchema = z.object({ quantity: z.number().int().positive() });
