import type { RequestHandler } from 'express';
import type { AuthService } from '../services/AuthService';

export function authController(auth: AuthService): { register: RequestHandler; login: RequestHandler } {
  return {
    register: (request, response, next) => {
      auth.register(request.body).then(result => response.status(201).json(result)).catch(next);
    },
    login: (request, response, next) => {
      auth.login(request.body).then(result => response.json(result)).catch(next);
    },
  };
}
