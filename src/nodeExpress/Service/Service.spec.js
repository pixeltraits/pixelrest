import { describe, it, expect, vi } from 'vitest';
import Auth from 'pixelrest/auth';
import Middleware from 'pixelrest/middleware';
import HttpResolver from 'pixelrest/httpResolver';
import ServiceAbstractClassMock from './ServiceAbstractClassMock.js';
import ServiceErrorMock from './ServiceErrorMock.js';
import { getListByIdSchema } from "./service-mock.schema.js";
import { SERVICE_ERRORS } from "../service-errors.config.js";


describe('Service', () => {

  describe(`constructor should`, () => {

    Middleware.multer = (req, res, next, _config) => {
      next();
    };
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
        authorization: `Bearer ${token}`
      },
      url: '/get-list/5',
      method: 'GET'
    };
    const reqModeratorMock = {
      headers: {
        authorization: `Bearer ${token}`
      },
      url: '/moderator-route',
      method: 'POST'
    };
    const reqMockWithShortTokenTime = {
      headers: {
        authorization: `Bearer ${shortTokenTime}`
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
        authorization: `Bearer ${token}`
      },
      url: '/admin-route',
      method: 'GET'
    };
    const reqMockMulterRoute = {
      headers: {
        authorization: `Bearer ${token}`
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

    it(`throw an error if initRoutes is called without routesConfig`, () => {
      const service = new ServiceErrorMock('tokenSecret');
      expect(() => {
        service.initRoutes();
      }).toThrow();
    });

    it(`set tokenData on req when request contains a valid token`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);

      await service.router.handle(reqMock, resMock, () => {});

      expect(reqMock.tokenData).toEqual(expect.objectContaining(tokenData));
    });

    it(`call multer middlewares if routeconfig multer is defined`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      vi.spyOn(Middleware, 'parseMulterBody');
      vi.spyOn(Middleware, 'multer').mockImplementation((req, res, next) => next());

      service.router.handle(reqMockMulterRoute, resMock, () => {});

      expect(Middleware.multer).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function), service.routesConfig[4].multerConfig);
      expect(Middleware.parseMulterBody).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function));

      vi.restoreAllMocks();
    });

    it(`don't call multer middlewares if routeconfig multer is not defined`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);

      vi.spyOn(Middleware, 'parseMulterBody');
      vi.spyOn(Middleware, 'multer');

      service.router.handle(reqMock, resMock, () => {});

      expect(Middleware.multer).not.toHaveBeenCalled();
      expect(Middleware.parseMulterBody).not.toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it(`call joi middleware`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      vi.spyOn(Middleware, 'joi');

      service.router.handle(reqMockMulterRoute, resMock, () => {});

      expect(Middleware.joi).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function), service.routesConfig[4].schema);

      vi.restoreAllMocks();
    });

    it(`call final route method without token if the route role is public`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      vi.spyOn(resMock, 'send');

      service.router.handle(reqPublicMock, resMock, () => {});

      expect(resMock.send).toHaveBeenCalledWith(2);

      vi.restoreAllMocks();
    });

    it(`call HttpResolver.unauthorized if token is empty and the route role is not public`, () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      vi.spyOn(HttpResolver, 'unauthorized').mockImplementation(() => {});

      service.router.handle(reqMockWithoutToken, resMock, () => {});

      expect(HttpResolver.unauthorized).toHaveBeenCalledWith(`Service token control`, `Any token received`, expect.any(Object));

      vi.restoreAllMocks();
    });

    it(`call HttpResolver.unauthorized if token is wrong and the route role is not public`, () => {
      const service = new ServiceAbstractClassMock('OtherSecret');
      vi.spyOn(HttpResolver, 'unauthorized').mockImplementation(() => {});

      service.router.handle(reqMock, resMock, () => {});

      expect(HttpResolver.unauthorized).toHaveBeenCalledWith(`Service token control`, `The user is not authorized`, expect.any(Object));

      vi.restoreAllMocks();
    });

    it(`call HttpResolver.unauthorized if token is expired and the route role is not public`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      vi.spyOn(HttpResolver, 'tokenExpired').mockImplementation(() => {});

      await wait(2000);
      service.router.handle(reqMockWithShortTokenTime, resMock, () => {});

      expect(HttpResolver.tokenExpired).toHaveBeenCalledWith(`Service token control`, `The token has expired`, expect.any(Object));

      vi.restoreAllMocks();
    });

    it(`call HttpResolver.unauthorized if token roles don't match with route roles`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      vi.spyOn(HttpResolver, 'unauthorized').mockImplementation(() => {});

      service.router.handle(reqModeratorMock, resMock, () => {});

      expect(HttpResolver.unauthorized).toHaveBeenCalledWith(`Service token control`, `This user has not sufficient rights`, expect.any(Object));

      vi.restoreAllMocks();
    });

    it(`execute adminRoleServiceMethod => (res.send with 3) if every Middleware is ok and route is get /admin-route`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      vi.spyOn(resMock, 'send');

      service.router.handle(reqMockAdminRoute, resMock, () => {});

      expect(resMock.send).toHaveBeenCalledWith(3);

      vi.restoreAllMocks();
    });

    it(`execute getListById => (res.send with 5) if every Middleware is ok and route is get /get-list/5`, async () => {
      const service = new ServiceAbstractClassMock(tokenSecret);
      vi.spyOn(resMock, 'send');

      service.router.handle(reqMock, resMock, () => {});

      expect(resMock.send).toHaveBeenCalledWith(5);

      vi.restoreAllMocks();
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
