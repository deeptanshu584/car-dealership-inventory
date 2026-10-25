import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/AppError';

export function validateBody(schema: ZodType): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          'Invalid request body',
          result.error.issues,
        ),
      );
      return;
    }
    request.body = result.data;
    next();
  };
}
