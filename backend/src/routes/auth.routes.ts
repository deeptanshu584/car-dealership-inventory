import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate';
import { loginSchema, registerSchema } from '../schemas/auth.schemas';
import type { AuthService } from '../services/AuthService';

export function authRoutes(auth: AuthService): Router {
  const router = Router();
  const controller = authController(auth);
  router.post('/register', validateBody(registerSchema), controller.register);
  router.post('/login', validateBody(loginSchema), controller.login);
  return router;
}
