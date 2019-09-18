const Service = require('../../src/utils/Service');

class ServiceAbstractClassMock extends Service {

  initRoute() {
    this.routesConfig = [
      {
        route: '/public-route',
        execute: 'mock',
        method: 'post',
        schema: null,
        roles: ['public']
      },
      {
        route: '/admin-route',
        execute: 'mock',
        method: 'post',
        schema: null,
        roles: ['admin']
      }
    ];
  }

  mock(req, res) {

  }

}

module.exports = ServiceAbstractClassMock;
