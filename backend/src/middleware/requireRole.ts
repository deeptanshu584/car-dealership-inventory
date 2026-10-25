import type { RequestHandler } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';
import type { UserRole } from '../repositories/IUserRepository';

export function requireRole(role: UserRole): RequestHandler {
  return (request, _response, next) => {
    if (!request.auth)
      return next(new UnauthorizedError('Authentication required'));
    if (request.auth.role !== role)
      return next(new ForbiddenError('Insufficient permissions'));
    next();
  };
}
