process.env.NODE_ENV = 'test';
import Auth from 'node-rest/auth';
import Middleware from 'node-rest/middleware';
import HttpResolver from 'node-rest/httpResolver';
import ServiceAbstractClassMock from '../../mocks/ServiceAbstractClassMock.js';
import ServiceErrorMock from '../../mocks/ServiceErrorMock.js';
import { getListByIdSchema } from "../../mocks/service-mock.schema.js";
import { SERVICE_ERRORS } from "../../../utils/nodeExpress/service-errors.config.js";


describe('Service', () => {

  describe(`constructor should`, () => {

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const tokenSecret = 'tokenSecret';
    const tokenData = {
      roles: ['admin'],
      id: 1
    };
    const token = Auth.sign(
      tokenData,
      tokenSecret,
      14400
    );
    const shortTokenTime = Auth.sign(
      tokenData,
      tokenSecret,
      1
    );
    const reqMock = {
      headers: {
        authorization: token
      },
      url: '/get-list/5',
      method: 'GET'
    };
    const reqModeratorMock = {
      headers: {
        authorization: token
      },
      url: '/moderator-route',
      method: 'POST'
    };
    const reqMockWithShortTokenTime = {
      headers: {
        authorization: shortTokenTime
      },
      url: '/get-list/5',
      method: 'GET'
    };
    const reqMockWithoutToken = {
      headers: {
      },
      url: '/get-list/5',
      method: 'GET'
    };
    const reqPublicMock = {
      headers: {
      },
      url: '/public-route',
      method: 'POST'
    };
    const reqMockAdminRoute = {
      headers: {
        authorization: token
      },
      url: '/admin-route',
      method: 'GET'
    };
    const reqMockMulterRoute = {
      headers: {
        authorization: token
      },
      url: '/multer-route',
      method: 'GET'
    };
    const resMock = {
      send: () => {

      }
    };
    const routesConfig = [
      {
        route: '/get-list/:id',
        execute: 'getListById',
        method: 'get',
        schema: getListByIdSchema,
        roles: ['admin']
      },
      {
        route: '/public-route',
        execute: 'publicServiceMethod',
        method: 'post',
        schema: null,
        roles: ['public']
      },
      {
        route: '/moderator-route',
        execute: 'publicServiceMethod',
        method: 'post',
        schema: null,
        roles: ['moderator']
      },
      {
        route: '/admin-route',
        execute: 'adminRoleServiceMethod',
        method: 'get',
        schema: null,
        roles: ['admin']
      },
      {
        route: '/multer-route',
        execute: 'multerServiceMethod',
        method: 'get',
        multerConfig: {
          uploadDirectory: 'temp',
          documentFieldName: 'fileDocument',
          multerMethodName: 'single',
          limits: {
            fieldSize: 2000000,
            fileSize: 100000000
          },
          allowedMimeTypes: [
            `image/png`,
            `image/gif`,
            `image/jpeg`
          ],
        },
        schema: null,
        roles: ['admin']
      }
    ];

    it(`set routesConfig property with initRoute mock value`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);

      expect(service.routesConfig).toEqual(routesConfig);
    });

    it(`throw an error if initRoute is not override`, () => {
      const error = new Error(`${SERVICE_ERRORS.INIT_ROUTE}ServiceErrorMock`);

      expect(() => {
        new ServiceErrorMock();
      }).toThrow(error);
    });

    it(`set tokenData when request contains a valid token`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);

      service.router.handle(reqMock, resMock, () => {});

      expect(service.tokenData).toEqual(jasmine.objectContaining(tokenData));
    });

    it(`call multer middlewares if routeconfig multer is defined`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      spyOn(Middleware, 'parseMulterBody').and.callThrough();
      spyOn(Middleware, 'multer').and.callThrough();

      service.router.handle(reqMockMulterRoute, resMock, () => {});

      expect(Middleware.multer).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object), jasmine.any(Function), service.routesConfig[4].multerConfig);
      expect(Middleware.parseMulterBody).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object), jasmine.any(Function));
    });

    it(`don't call multer middlewares if routeconfig multer is not defined`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);

      spyOn(Middleware, 'parseMulterBody').and.callThrough();
      spyOn(Middleware, 'multer').and.callThrough();

      service.router.handle(reqMock, resMock, () => {});

      expect(Middleware.multer).not.toHaveBeenCalled();
      expect(Middleware.parseMulterBody).not.toHaveBeenCalled();
    });

    it(`call joi middleware`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      spyOn(Middleware, 'joi').and.callThrough();

      service.router.handle(reqMockMulterRoute, resMock, () => {});

      expect(Middleware.joi).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object), jasmine.any(Function), service.routesConfig[3].schema);
    });

    it(`call final route method without token if the route role is public`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      spyOn(resMock, 'send').and.callThrough();

      service.router.handle(reqPublicMock, resMock, () => {});

      expect(resMock.send).toHaveBeenCalledWith(2);
    });

    it(`call HttpResolver.unauthorized if token is empty and the route role is not public`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      spyOn(HttpResolver, 'unauthorized');

      service.router.handle(reqMockWithoutToken, resMock, () => {});

      expect(HttpResolver.unauthorized).toHaveBeenCalledWith(`Service token control`, `Any token received`, jasmine.any(Object));
    });

    it(`call HttpResolver.unauthorized if token is wrong and the route role is not public`, () => {
      const service = new ServiceAbstractClassMock('OtherSecret');
      spyOn(HttpResolver, 'unauthorized');

      service.router.handle(reqMock, resMock, () => {});

      expect(HttpResolver.unauthorized).toHaveBeenCalledWith(`Service token control`, `The user is not authorized`, jasmine.any(Object));
    });

    it(`call HttpResolver.unauthorized if token is expired and the route role is not public`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      spyOn(HttpResolver, 'tokenExpired');

      await wait(2000);
      service.router.handle(reqMockWithShortTokenTime, resMock, () => {});

      expect(HttpResolver.tokenExpired).toHaveBeenCalledWith(`Service token control`, `The token has expired`, jasmine.any(Object));
    });

    it(`call HttpResolver.unauthorized if token roles don't match with route roles`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      spyOn(HttpResolver, 'unauthorized');

      service.router.handle(reqModeratorMock, resMock, () => {});

      expect(HttpResolver.unauthorized).toHaveBeenCalledWith(`Service token control`, `This user has not suffisent rights`, jasmine.any(Object));
    });

    it(`execute adminRoleServiceMethod => (res.send with 3) if every Middleware is ok and route is get /admin-route`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      spyOn(resMock, 'send');

      service.router.handle(reqMockAdminRoute, resMock, () => {});

      expect(resMock.send).toHaveBeenCalledWith(3);
    });

    it(`execute getListById => (res.send with 5) if every Middleware is ok and route is get /get-list/5`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      spyOn(resMock, 'send');

      service.router.handle(reqMock, resMock, () => {});

      expect(resMock.send).toHaveBeenCalledWith(5);
    });

  });

  describe(`setRepositories should`, () => {

    it(`set repositories property`, () => {
      const service = new ServiceAbstractClassMock('tokenSecret');
      const repositories = [2, 'test', {}];

      service.setRepositories(repositories);

      expect(service.repositories).toBe(repositories);
    });

  });

  describe(`getRouter should`, () => {

    it(`return router property`, () => {
      const service = new ServiceAbstractClassMock('tokenSecret');

      const router = service.getRouter();

      expect(router).toBe(service.router);
    });

  });

});
