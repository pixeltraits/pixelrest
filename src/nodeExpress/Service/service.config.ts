import type { MulterConfig, RouteSchema } from '../Middleware/middleware.config.js';

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

export interface RouteConfig {
  route: string;
  execute: string;
  method: string;
  schema: RouteSchema | null;
  roles: string[];
  multerConfig?: MulterConfig;
  rateLimit?: RateLimitConfig;
}
