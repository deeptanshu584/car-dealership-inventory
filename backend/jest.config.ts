import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  coverageThreshold: {
    global: { statements: 90, branches: 0, functions: 90, lines: 90 },
  },
};
export default config;
