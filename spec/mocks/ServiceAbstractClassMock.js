import Service from 'node-rest/service';
import { getListByIdSchema } from "./service-mock.schema.js";




export default class ServiceAbstractClassMock extends Service {

  initRoute() {
    this.routesConfig = [
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
  }

  getListById(req, res) {
    const id = req.params.id;
    res.send(parseInt(id));
  }

  publicServiceMethod(req, res) {
    res.send(2);
  }

  adminRoleServiceMethod(req, res) {
    res.send(3);
  }

  multerServiceMethod(req, res) {
    res.send(4);
  }

}
