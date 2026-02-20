export const ROLES = {
  PUBLIC: 'public'
} as const;

export interface TokenData {
  id: number;
  roles: string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}
