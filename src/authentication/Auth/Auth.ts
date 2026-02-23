import { SignJWT, jwtVerify, errors } from 'jose';

import { ROLES } from './auth.config.js';
import type { TokenData } from './auth.config.js';

export default class Auth {
  static async sign(data: TokenData, secret: string, timeLimit: number): Promise<string> {
    const secretKey = new TextEncoder().encode(secret);
    return new SignJWT(data as Record<string, unknown>)
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(`${timeLimit}s`)
      .sign(secretKey);
  }

  static async verify(token: string, secret: string): Promise<TokenData> {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ['HS256'] });
    return payload as unknown as TokenData;
  }

  static isExpiredError(error: unknown): boolean {
    return error instanceof errors.JWTExpired;
  }

  static checkMultiRoles(authorizedRoles: string[], userRoles: string[]): boolean {
    const a = new Set(authorizedRoles);
    const b = new Set(userRoles);
    const intersection = new Set(
      [...a].filter(x => b.has(x))
    );

    return intersection.size !== 0;
  }

  static hasPublicRole(authorizedRoles: string[]): boolean {
    return !!authorizedRoles.find(authorizedRole => authorizedRole === ROLES.PUBLIC);
  }
}
