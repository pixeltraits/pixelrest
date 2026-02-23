import type { HelmetOptions } from 'helmet';

export enum SERVER_ERROR_CODES {
  PORT_ALREADY_IN_USE = 'EADDRINUSE'
}

export const SERVER_STRINGS = {
  PORT: 'Port ',
  ALREADY_IN_USE: ' already in use',
  LISTENING_ON: 'Listening on '
} as const;

export interface SecurityHeadersConfig {
  corsOrigin: string | false;
  corsMethods?: string;
  corsHeaders?: string;
  helmet?: HelmetOptions;
}

export const DEFAULT_SECURITY_HEADERS_CONFIG: Omit<SecurityHeadersConfig, 'helmet'> = {
  corsOrigin: false,
  corsMethods: 'GET, PUT, POST, PATCH, DELETE, OPTIONS',
  corsHeaders: 'Content-Type, Authorization, Content-Length, X-Requested-With'
};

export const SECURITY_WARNINGS = {
  CORS_WILDCARD: '[PixelRest] Security warning: corsOrigin is set to "*". All origins can access your API.',
  CORS_DISABLED: '[PixelRest] Security warning: corsOrigin is not configured. Cross-origin requests will be blocked.'
} as const;

export const ENV_ERRORS = {
  MISSING_VARS: (vars: string[]) => `[PixelRest] Missing required environment variables: ${vars.join(', ')}`,
  EMPTY_TOKEN_SECRET: '[PixelRest] tokenSecret is required and cannot be empty. Make sure JWT_SECRET environment variable is defined before starting the server.'
} as const;
