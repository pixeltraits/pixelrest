import { describe, it, expect } from 'vitest';
import Auth from 'pixelrest/auth';
import { errors } from 'jose';

import { ROLES } from "./auth.config.js";


describe('Auth', () => {

  const data = {
    id: 5,
    roles: [
      'admin',
      'moderator'
    ]
  };
  const secret = 'secretpass';
  const timeLimit = 10000;

  describe(`sign should`, () => {

    it(`return a json web token`, async () => {
      const token = await Auth.sign(data, secret, timeLimit);
      const tokenData = await Auth.verify(token, secret);

      expect(tokenData).toEqual(expect.objectContaining(data));
    });

  });

  describe(`verify should`, () => {

    it(`return token data if the token is valid`, async () => {
      const token = await Auth.sign(data, secret, timeLimit);
      const tokenData = await Auth.verify(token, secret);

      expect(tokenData).toEqual(expect.objectContaining(data));
    });

    it(`return error if token is invalid`, async () => {
      const token = await Auth.sign(data, secret, timeLimit);

      await expect(Auth.verify(token, 'wrongsecret')).rejects.toThrow();
    });

  });

  describe(`isExpiredError should`, () => {

    it(`return true if error is a JWTExpired instance`, () => {
      const expiredError = new errors.JWTExpired('jwt expired');

      expect(Auth.isExpiredError(expiredError)).toBe(true);
    });

    it(`return false if error is a generic Error`, () => {
      expect(Auth.isExpiredError(new Error('jwt expired'))).toBe(false);
    });

    it(`return false if error is not an Error`, () => {
      expect(Auth.isExpiredError('jwt expired')).toBe(false);
    });

  });

  describe(`checkMultiRoles should`, () => {

    const authorizedRoles = [
      'admin',
      'moderator'
    ];

    it(`return true if authorizedRoles and userRoles have one or more similar role`, () => {
      const roles = [
        'admin',
        'member'
      ];

      const isAuthorized = Auth.checkMultiRoles(authorizedRoles, roles);

      expect(isAuthorized).toBeTruthy();
    });

    it(`return false if authorizedRoles and userRoles have no similar role`, () => {
      const roles = [
        'member'
      ];

      const isAuthorized = Auth.checkMultiRoles(authorizedRoles, roles);

      expect(isAuthorized).toBeFalsy();
    });

  });

  describe(`hasPublicRole should`, () => {

    it(`return true if authorizedRoles contain PUBLIC role`, () => {
      const roles = [
        ROLES.PUBLIC
      ];

      const hasPublic = Auth.hasPublicRole(roles);

      expect(hasPublic).toBeTruthy();
    });

    it(`return false if authorizedRoles have no PUBLIC role`, () => {
      const roles = [
        'admin'
      ];

      const hasPublic = Auth.hasPublicRole(roles);

      expect(hasPublic).toBeFalsy();
    });

  });

});
