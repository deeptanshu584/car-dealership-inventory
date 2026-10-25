import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../errors/AppError';

export function validateQuery(schema: ZodType): RequestHandler {
  return (request, response, next) => {
    const result = schema.safeParse(request.query);
    if (!result.success)
      return next(
        new AppError(
          400,
          'VALIDATION_ERROR',
          'Invalid query',
          result.error.issues,
        ),
      );
    response.locals.query = result.data;
    next();
  };
}
