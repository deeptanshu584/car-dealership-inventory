import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError';

export function authenticate(secret: string): RequestHandler {
  return (request, _response, next) => {
    const match = /^Bearer (.+)$/.exec(request.headers.authorization ?? '');
    if (!match) return next(new UnauthorizedError('Authentication required'));
    try {
      const payload = jwt.verify(match[1], secret);
      if (
        typeof payload === 'string' ||
        !payload.sub ||
        (payload.role !== 'USER' && payload.role !== 'ADMIN')
      )
        throw new Error('Invalid payload');
      request.auth = { userId: payload.sub, role: payload.role };
      next();
    } catch {
      next(new UnauthorizedError('Invalid token'));
    }
  };
}
