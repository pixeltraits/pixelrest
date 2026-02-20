import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['example/tests/functional/**/*.test.ts'],
    testTimeout: 30000,
    globals: true
  }
});
