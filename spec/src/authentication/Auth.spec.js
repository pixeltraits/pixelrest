process.env.NODE_ENV = 'test';
import Auth from 'node-rest/auth';
import jwt from 'jsonwebtoken';

import { ROLES } from "../../../src/authentication/auth.config.js";


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
  let expectedToken = jwt.sign(
    data,
    secret,
    { expiresIn: timeLimit }
  );

  describe(`sign should`, () => {

    it(`return a json web token`, () => {
      const token = Auth.sign(data, secret, timeLimit);
      const tokenData = jwt.verify(token, secret);

      expect(tokenData).toEqual(jasmine.objectContaining(data));
    });

  });

  describe(`verify should`, () => {

    it(`return token data if the token is valid`, () => {
      const tokenData = Auth.verify(expectedToken, secret);

      expect(tokenData).toEqual(jasmine.objectContaining(data));
    });

    it(`return error if token is invalid`, () => {
      expect(() => {
        Auth.verify(expectedToken, '5555');
      }).toThrow();
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
