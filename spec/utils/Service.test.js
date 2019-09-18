/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');

chai.should();
chai.use(require('chai-things'));

const ServiceAbstractClassMock = require('../mocks/ServiceAbstractClassMock');
const JWT_CONFIG = require('../../src/config/jwt');

const expect = chai.expect;

describe('Service', () => {

  let service = null;
  let databaseGateway = null;

  beforeEach(() => {
    databaseGateway = {};
    service = new ServiceAbstractClassMock(databaseGateway);
  });

  describe('constructor should', () => {

    it('prepare service object', () => {
      service.routesConfig.should.all.have.property('route');
      service.routesConfig.should.all.have.property('execute');
      service.routesConfig.should.all.have.property('method');
      service.routesConfig.should.all.have.property('schema');
      service.routesConfig.should.all.have.property('roles');
      expect(service.tokenData).to.equal(null);
    });
  });

  describe('authorizationControl should', () => {

    it('be true if route accepts public roles', () => {
      const route = {
        route: '/public-route',
        execute: 'mock',
        method: 'post',
        schema: null,
        roles: ['public']
      };

      const authorized = service.authorizationControl({}, {}, route);

      expect(authorized).to.equal(true);
    });

    it('be true if route accepts admin role, with correct token and correct role', () => {
      const route = {
        route: '/private-route',
        execute: 'mock',
        method: 'post',
        schema: null,
        roles: ['admin']
      };

      const req = {
        headers: {
          authorization: jwt.sign(
            { id: 0, roles: ['admin'] },
            JWT_CONFIG.SECRET,
            { expiresIn: 14400 }
          )
        }
      };

      const res = httpMocks.createResponse();

      const authorized = service.authorizationControl(req, res, route);

      expect(authorized).to.equal(true);
    });

    it('be false if route needs a token and it is empty', () => {
      const route = {
        route: '/private-route',
        execute: 'mock',
        method: 'post',
        schema: null,
        roles: ['admin']
      };

      const req = {
        headers: { authorization: null }
      };

      const res = httpMocks.createResponse();

      const authorized = service.authorizationControl(req, res, route);

      expect(authorized).to.equal(false);
    });

    it('be false if route needs a token and it is incorrect', () => {
      const route = {
        route: '/private-route',
        execute: 'mock',
        method: 'post',
        schema: null,
        roles: ['admin']
      };

      const req = {
        headers: {
          authorization: { token: 'wrongtoken' }
        }
      };

      const res = httpMocks.createResponse();

      const authorized = service.authorizationControl(req, res, route);

      expect(authorized).to.equal(false);
    });

    it('be false if roles do not match ', () => {
      const route = {
        route: '/private-route',
        execute: 'mock',
        method: 'post',
        schema: null,
        roles: ['admin']
      };

      const req = {
        headers: {
          authorization: jwt.sign(
            { id: 0, roles: ['user'] },
            JWT_CONFIG.SECRET,
            { expiresIn: 14400 }
          )
        }
      };

      const res = httpMocks.createResponse();

      const authorized = service.authorizationControl(req, res, route);

      expect(authorized).to.equal(false);
    });
  });
});
