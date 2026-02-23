import { describe, it, expect, vi, afterEach } from 'vitest';
import Server from './Server.js';

describe('Server.validateEnv', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should not throw when all required vars are defined', () => {
    vi.stubEnv('TEST_VAR_A', 'value_a');
    vi.stubEnv('TEST_VAR_B', 'value_b');

    expect(() => Server.validateEnv(['TEST_VAR_A', 'TEST_VAR_B'])).not.toThrow();
  });

  it('should not throw for an empty list', () => {
    expect(() => Server.validateEnv([])).not.toThrow();
  });

  it('should throw when a required var is missing', () => {
    expect(() => Server.validateEnv(['PIXELREST_DEFINITELY_UNDEFINED_VAR'])).toThrow();
  });

  it('should throw listing all missing variables in the error message', () => {
    expect(() => Server.validateEnv(['PIXELREST_MISSING_ONE', 'PIXELREST_MISSING_TWO']))
      .toThrow(/PIXELREST_MISSING_ONE/);
    expect(() => Server.validateEnv(['PIXELREST_MISSING_ONE', 'PIXELREST_MISSING_TWO']))
      .toThrow(/PIXELREST_MISSING_TWO/);
  });

  it('should throw when a var is defined but empty', () => {
    vi.stubEnv('EMPTY_VAR', '');

    expect(() => Server.validateEnv(['EMPTY_VAR'])).toThrow();
  });

  it('should not throw when only some vars are required and all are defined', () => {
    vi.stubEnv('DEFINED_VAR', 'some_value');

    expect(() => Server.validateEnv(['DEFINED_VAR'])).not.toThrow();
  });
});
