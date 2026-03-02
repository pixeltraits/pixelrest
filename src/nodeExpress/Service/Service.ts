import rateLimit from 'express-rate-limit';
import express, { type Router, type Request, type Response, type NextFunction, type RequestHandler } from 'express';

import Auth from '../../authentication/Auth/Auth.js';
import Middleware from '../Middleware/Middleware.js';
import HttpResolver from '../../loggers/HttpResolver/HttpResolver.js';
import type { TokenData } from '../../authentication/Auth/auth.config.js';
import type { RouteConfig, RateLimitConfig } from './service.config.js';
import { SERVICE_ERRORS } from '../service-errors.config.js';
import { ENV_ERRORS } from '../Server/server-errors.config.js';

export default abstract class Service<R extends Record<string, object> = Record<string, object>> {
  protected router: Router = express.Router();
  protected abstract routesConfig: RouteConfig[];
  protected tokenSecret: string;
  protected repositories: R = {} as R;

  protected constructor(tokenSecret: string) {
    if (!tokenSecret) {
      throw new Error(ENV_ERRORS.EMPTY_TOKEN_SECRET);
    }
    this.tokenSecret = tokenSecret;
  }

  protected initRoutes(): void {
    this.routesConfig.forEach((routeConfig) => {
      this.addRoute(routeConfig);
    });
  }

  setRepositories(repositories: Record<string, unknown>): void {
    this.repositories = repositories as unknown as R;
  }

  getRouter(): Router {
    return this.router;
  }

  private addRoute(routeConfig: RouteConfig): void {
    const multerMiddlewares: RequestHandler[] = [
      (req, res, next) => Middleware.multer(req, res, next, routeConfig.multerConfig!),
      (req, res, next) => Middleware.parseMulterBody(req, res, next)
    ];
    const commonMiddlewares: RequestHandler[] = [
      (req, res, next) => Middleware.validate(req, res, next, routeConfig.schema),
      (req, res, next) => this.authorizationMiddleware(req, res, next, routeConfig.roles),
      (req, res) => this.serviceMethodExecution(req, res, routeConfig.execute)
    ];
    let middlewares: RequestHandler[] = commonMiddlewares;

    if (routeConfig.multerConfig) {
      middlewares = [...multerMiddlewares, ...commonMiddlewares];
    }

    if (routeConfig.rateLimit) {
      middlewares = [Service.buildRateLimitMiddleware(routeConfig.rateLimit), ...middlewares];
    }

    type RouterMethodFn = (path: string, ...handlers: RequestHandler[]) => void;
    (this.router as unknown as Record<string, RouterMethodFn>)[routeConfig.method](
      routeConfig.route,
      ...middlewares
    );
  }

  private static buildRateLimitMiddleware(rateLimitConfig: RateLimitConfig): RequestHandler {
    return rateLimit({
      windowMs: rateLimitConfig.windowMs,
      limit: rateLimitConfig.max,
      message: rateLimitConfig.message ?? 'Too many requests, please try again later.'
    });
  }

  private async authorizationMiddleware(req: Request, res: Response, next: NextFunction, authorizedRoles: string[]): Promise<void> {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (Auth.hasPublicRole(authorizedRoles)) {
      next();
      return;
    }

    if (!token) {
      return Service.sendEmptyTokenError(res);
    }

    let tokenData!: TokenData;
    try {
      tokenData = await Auth.verify(token, this.tokenSecret);
    } catch (error) {
      return Service.sendTokenError(res, error);
    }

    req.tokenData = tokenData;

    if (!Auth.checkMultiRoles(authorizedRoles, tokenData.roles)) {
      return Service.sendRoleError(res);
    }

    next();
  }

  private serviceMethodExecution(req: Request, res: Response, methodeName: string): void {
    (this as unknown as Record<string, (req: Request, res: Response) => void>)[methodeName](req, res);
  }

  private static sendEmptyTokenError(res: Response): void {
    HttpResolver.unauthorized(
      SERVICE_ERRORS.SERVICE_TOKEN_ERROR,
      SERVICE_ERRORS.ANY_TOKEN,
      res
    );
  }

  private static sendTokenError(res: Response, error: unknown): void {
    if (Auth.isExpiredError(error)) {
      return HttpResolver.tokenExpired(
        SERVICE_ERRORS.SERVICE_TOKEN_ERROR,
        SERVICE_ERRORS.EXPIRED_TOKEN,
        res
      );
    }

    return HttpResolver.unauthorized(
      SERVICE_ERRORS.SERVICE_TOKEN_ERROR,
      SERVICE_ERRORS.UNAUTHORIZED_USER,
      res
    );
  }

  private static sendRoleError(res: Response): void {
    HttpResolver.unauthorized(
      SERVICE_ERRORS.SERVICE_TOKEN_ERROR,
      SERVICE_ERRORS.RIGHTS_ERROR,
      res
    );
  }
}
