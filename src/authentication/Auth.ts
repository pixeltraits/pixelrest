import jwt from 'jsonwebtoken';

import { ROLES } from './auth.config.js';
import type { TokenData } from './auth.config.js';

export default class Auth {
  static sign(data: TokenData, secret: string, timeLimit: number): string {
    return jwt.sign(
      data,
      secret,
      { expiresIn: timeLimit, algorithm: 'HS256' }
    );
  }

  static verify(token: string, secret: string): TokenData {
    return jwt.verify(token, secret, { algorithms: ['HS256'] }) as TokenData;
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
