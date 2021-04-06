import Service from 'node-rest/service';


export default class ServiceAbstractClassMock extends Service {

  initRoute() {
    this.routesConfig = [
      {
        route: '/public-route',
        execute: 'publicServiceMethod',
        method: 'post',
        schema: null,
        roles: ['public']
      },
      {
        route: '/admin-route',
        execute: 'adminRoleServiceMethod',
        method: 'post',
        schema: null,
        roles: ['admin']
      }
    ];
  }

  publicServiceMethod(req, res) {

  }

  adminRoleServiceMethod(req, res) {

  }

}
