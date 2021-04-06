process.env.NODE_ENV = 'test';
import Auth from 'node-rest/auth';
import ServiceAbstractClassMock from '../../mocks/ServiceAbstractClassMock.js';
import ServiceWithoutRoutesMock from "../../mocks/ServiceWithoutRoutesMock.js";
import ServiceErrorMock from '../../mocks/ServiceErrorMock.js';
import { SERVICE_ERRORS } from "../../../utils/nodeExpress/service-errors.config.js";


describe('Service', () => {

  describe(`constructor should`, () => {

    const tokenSecret = 'tokenSecret';
    const token = Auth.sign(
      {
        roles: ['admin'],
        id: 1
      },
      tokenSecret,
      14400
    );
    const reqMock = {
      headers: {
        authorization: token
      }
    };
    const resMock = {};

    it(`set routesConfig property with initRoute mock value`, () => {
      const routesConfig = [
        {
          route: '/public-route',
          execute: 'publicServiceMethod',
          method: 'post',
          schema: [],
          roles: ['public']
        },
        {
          route: '/admin-route',
          execute: 'adminRoleServiceMethod',
          method: 'post',
          schema: [],
          roles: ['admin']
        }
      ];

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

      //expect(service.router).toEqual(expressRouter);
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
