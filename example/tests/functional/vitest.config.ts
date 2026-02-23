import { defineConfig } from 'vitest/config';
import { BaseSequencer } from 'vitest/node';

class SecurityLastSequencer extends BaseSequencer {
  async sort(files: Parameters<BaseSequencer['sort']>[0]) {
    const sorted = await super.sort(files);
    const security = sorted.filter(s => s.moduleId.includes('security'));
    const others = sorted.filter(s => !s.moduleId.includes('security'));
    return [...others, ...security];
  }
}

export default defineConfig({
  test: {
    include: ['example/tests/functional/**/*.test.ts'],
    testTimeout: 30000,
    globals: true,
    fileParallelism: false,
    sequence: {
      sequencer: SecurityLastSequencer
    }
  }
});
