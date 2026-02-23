import helmet from 'helmet';
import type { RequestHandler, Request, Response, NextFunction } from 'express';
import Logger from '../../loggers/Logger/Logger.js';
import {
  SERVER_STRINGS,
  SERVER_ERROR_CODES,
  DEFAULT_SECURITY_HEADERS_CONFIG,
  SECURITY_WARNINGS,
  ENV_ERRORS,
  type SecurityHeadersConfig
} from './server-errors.config.js';

export default class Server {
  static onError(error: NodeJS.ErrnoException, port: number): void {
    if (error.code === SERVER_ERROR_CODES.PORT_ALREADY_IN_USE) {
      Logger.handleError(`${SERVER_STRINGS.PORT}${port}${SERVER_STRINGS.ALREADY_IN_USE}`);
      process.exit(1);
      return;
    }

    throw error;
  }

  static onListening(host: string, port: number): void {
    Logger.handleLog(`${SERVER_STRINGS.LISTENING_ON}${host}:${port}`);
  }

  static validateEnv(requiredVars: string[]): void {
    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
      throw new Error(ENV_ERRORS.MISSING_VARS(missing));
    }
  }

  static securityHeaders(securityHeadersConfig?: Partial<SecurityHeadersConfig>): RequestHandler[] {
    const mergedConfig: SecurityHeadersConfig = { ...DEFAULT_SECURITY_HEADERS_CONFIG, ...securityHeadersConfig };

    if (mergedConfig.corsOrigin === '*') {
      Logger.handleLog(SECURITY_WARNINGS.CORS_WILDCARD);
    } else if (!mergedConfig.corsOrigin) {
      Logger.handleLog(SECURITY_WARNINGS.CORS_DISABLED);
    }

    return [helmet(mergedConfig.helmet), Server.corsMiddleware(mergedConfig)];
  }

  private static corsMiddleware(securityHeadersConfig: SecurityHeadersConfig): RequestHandler {
    return (_req: Request, res: Response, next: NextFunction): void => {
      if (securityHeadersConfig.corsOrigin) {
        res.setHeader('Access-Control-Allow-Origin', securityHeadersConfig.corsOrigin);
      }
      res.setHeader('Access-Control-Allow-Methods', securityHeadersConfig.corsMethods ?? DEFAULT_SECURITY_HEADERS_CONFIG.corsMethods!);
      res.setHeader('Access-Control-Allow-Headers', securityHeadersConfig.corsHeaders ?? DEFAULT_SECURITY_HEADERS_CONFIG.corsHeaders!);
      next();
    };
  }
}
