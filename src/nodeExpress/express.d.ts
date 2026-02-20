import type { TokenData } from '../authentication/auth.config.js';

declare module 'express-serve-static-core' {
  interface Request {
    tokenData?: TokenData;
  }
}
