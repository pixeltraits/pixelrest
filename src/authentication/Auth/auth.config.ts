export enum ROLES {
  PUBLIC = 'public'
}

export interface TokenData {
  id: number;
  roles: string[];
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}
