import { loadEnv } from '../../src/config/env';

it('requires JWT_SECRET', () => {
  expect(() => loadEnv({ DATABASE_URL: 'file:./test.db' })).toThrow('JWT_SECRET');
});

it('reads valid settings with defaults', () => {
  expect(loadEnv({ JWT_SECRET: 'long-secret', DATABASE_URL: 'file:./test.db' })).toMatchObject({ jwtSecret: 'long-secret', port: 4000 });
});
