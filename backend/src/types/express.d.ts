import type { UserRole } from '../repositories/IUserRepository';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; role: UserRole };
    }
  }
}
export {};
