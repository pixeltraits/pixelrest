export interface MulterConfig {
  uploadDirectory: string;
  documentFieldName: string;
  multerMethodName: string;
  limits: { fieldSize: number; fileSize: number };
  allowedMimeTypes: string[];
}

export interface JoiSchemaSegment {
  validate(value: unknown): { error?: unknown };
}

export interface JoiRouteSchema {
  body?: JoiSchemaSegment;
  params?: JoiSchemaSegment;
  query?: JoiSchemaSegment;
}
