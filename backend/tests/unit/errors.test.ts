import {
  AppError,
  ConflictError,
  NotFoundError,
} from '../../src/errors/AppError';

it('typed errors preserve status and public error codes', () => {
  expect(new AppError(400, 'VALIDATION_ERROR', 'Bad input')).toMatchObject({
    status: 400,
    code: 'VALIDATION_ERROR',
    message: 'Bad input',
  });
  expect(new ConflictError('Duplicate')).toMatchObject({
    status: 409,
    code: 'CONFLICT',
  });
  expect(new NotFoundError('Missing')).toMatchObject({
    status: 404,
    code: 'NOT_FOUND',
  });
});
