import type { MulterConfig, JoiRouteSchema } from '../Middleware/middleware.config.js';

export interface RouteConfig {
  route: string;
  execute: string;
  method: string;
  schema: JoiRouteSchema | null;
  roles: string[];
  multerConfig?: MulterConfig;
}
