import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password requires a letter and digit'),
});
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
