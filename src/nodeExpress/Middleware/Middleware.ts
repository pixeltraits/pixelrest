import path from 'path';
import multer from 'multer';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

import HttpResolver from '../../loggers/HttpResolver/HttpResolver.js';
import type { MulterConfig, RouteSchema, SchemaSegment } from './middleware.config.js';
import { SERVICE_ERRORS } from '../service-errors.config.js';

export default class Middleware {
  static parseMulterBody(req: Request, res: Response, next: NextFunction): void {
    const body = req.body as Record<string, unknown>;

    if (!body || body.length === 0) {
      next();
      return;
    }

    Object.keys(body).forEach(bodyProperty => {
      const value = body[bodyProperty];
      if (
        typeof value === 'string' &&
        value[0] === '{' &&
        value[value.length - 1] === '}'
      ) {
        try {
          body[bodyProperty] = JSON.parse(value);
        } catch {
          // keep original string value if JSON parsing fails
        }
      }
    });
    req.body = body;

    next();
  }

  static validate(req: Request, res: Response, next: NextFunction, schema: RouteSchema | null): void {
    if (schema) {
      let validationStatus = true;
      if (schema.body && !Middleware.zodValidation(req.body, schema.body, res)) {
        validationStatus = false;
      }
      if (schema.params && !Middleware.zodValidation(req.params, schema.params, res)) {
        validationStatus = false;
      }
      if (schema.query && !Middleware.zodValidation(req.query, schema.query, res)) {
        validationStatus = false;
      }
      if (validationStatus) {
        next();
      }
    } else {
      next();
    }
  }

  private static zodValidation(requestSegment: unknown, schemaSegment: SchemaSegment, res: Response): boolean {
    const result = schemaSegment.safeParse(requestSegment);

    if (!result.success) {
      HttpResolver.serviceUnavailable('Zod', `${SERVICE_ERRORS.VALIDATION_ERROR}${result.error}`, res);
      return false;
    }

    return true;
  }

  static multer(req: Request, res: Response, next: NextFunction, multerConfig: MulterConfig): void {
    const multerMiddleware = multer({
      dest: multerConfig.uploadDirectory,
      limits: multerConfig.limits,
      fileFilter: Middleware.controlMimeType(multerConfig)
    });
    const multerFunctionMiddleware = (multerMiddleware as unknown as Record<string, (fieldName: string) => RequestHandler>)[multerConfig.multerMethodName](multerConfig.documentFieldName);

    multerFunctionMiddleware(req, res, next);
  }

  private static controlMimeType(multerConfig: MulterConfig) {
    return (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (file.originalname) {
        file.originalname = Middleware.sanitizeFilename(file.originalname);
      }
      if (multerConfig.allowedMimeTypes.findIndex(allowedMimeType => allowedMimeType === file.mimetype) === -1) {
        return cb(new Error(SERVICE_ERRORS.MIME_TYPE_ERROR));
      }
      return cb(null, true);
    };
  }

  private static sanitizeFilename(filename: string): string {
    return path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  }
}
