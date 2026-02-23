export interface MulterConfig {
  uploadDirectory: string;
  documentFieldName: string;
  multerMethodName: string;
  limits: { fieldSize: number; fileSize: number };
  allowedMimeTypes: string[];
}

export interface SchemaSegment {
  safeParse(value: unknown): { success: boolean; error?: unknown };
}

export interface RouteSchema {
  body?: SchemaSegment;
  params?: SchemaSegment;
  query?: SchemaSegment;
}
