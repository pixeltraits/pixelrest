import Service from 'node-rest/service';


export default class ServiceWithoutRoutesMock extends Service {

  initRoute() {
    this.routesConfig = [];
  }

}
