import { describe, it, expect } from 'vitest';
import Service from './Service.js';
import type { RouteConfig } from './service.config.js';

class ConcreteService extends Service {
  protected routesConfig: RouteConfig[] = [];

  constructor(tokenSecret: string) {
    super(tokenSecret);
  }
}

describe('Service constructor - tokenSecret validation', () => {
  it('should initialize correctly with a valid tokenSecret', () => {
    expect(() => new ConcreteService('valid-secret-key')).not.toThrow();
  });

  it('should throw when tokenSecret is an empty string', () => {
    expect(() => new ConcreteService('')).toThrow();
  });

  it('should throw when tokenSecret is undefined', () => {
    expect(() => new ConcreteService(undefined as unknown as string)).toThrow();
  });

  it('should include JWT_SECRET in the error message', () => {
    expect(() => new ConcreteService('')).toThrow(/JWT_SECRET/);
  });
});
