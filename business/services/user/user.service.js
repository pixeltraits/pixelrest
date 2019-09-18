const Auth = require('../../../utils/Auth');
const HttpResolver = require('../../../utils/HttpResolver');
const Service = require('../../../utils/Service');
const POSTGRES_DB = require('../../config/postgresDb');
const HTTP_METHODS = require('../../config/http-methods');
const ROLES = require('../../config/roles');
const {
  getUserSchema,
  postUserSchema,
  updateInformationsSchema,
  updatePasswordSchema
} = require('./user.schema');
const { Password } = require('../../models/business/password');


class UserService extends Service {

  initRoute() {
    this.routesConfig = [
      {
        route: '/users',
        execute: 'get',
        method: HTTP_METHODS.GET,
        schema: null,
        roles: [ROLES.ADMIN, ROLES.USER]
      },
      {
        route: '/users/current',
        execute: 'getCurrent',
        method: HTTP_METHODS.GET,
        schema: null,
        roles: [ROLES.ADMIN, ROLES.USER]
      },
      {
        route: '/users/:id',
        execute: 'getById',
        method: HTTP_METHODS.GET,
        schema: getUserSchema,
        roles: [ROLES.ADMIN, ROLES.USER]
      },
      {
        route: '/users',
        execute: 'post',
        method: HTTP_METHODS.POST,
        schema: postUserSchema,
        roles: [ROLES.ADMIN]
      },
      {
        route: '/users/update-info',
        execute: 'updateInformations',
        method: HTTP_METHODS.PUT,
        schema: updateInformationsSchema,
        roles: [ROLES.ADMIN, ROLES.USER]
      },
      {
        route: '/users/update-pass',
        execute: 'updatePassword',
        method: HTTP_METHODS.PUT,
        schema: updatePasswordSchema,
        roles: [ROLES.ADMIN, ROLES.USER]
      }
    ];
  }

  get(req, res) {
    return POSTGRES_DB.users.findAll()
      .then(users => res.send(users))
      .catch(e => HttpResolver.handle(e, 'UserService#get', res));
  }

  getCurrent(req, res) {
    const token = Auth.verify(req.headers.authorization);
    if (!token || !token.id) {
      return HttpResolver.handle(new Error('Invalid token - missing id'), 'UserService#getCurrent', res);
    }
    return this.getById(req, res, token.id);
  }

  getById(req, res, id = null) {
    return POSTGRES_DB.users.findById(id || req.params.id)
      .then(user => res.send(user))
      .catch(e => HttpResolver.handle(e, 'UserService#getById', res));
  }

  post(req, res) {
    const user = UserFactory.forCreation({
      ...req.body,
      password: Password.hash(req.body.password)
    });
    return POSTGRES_DB.users.add(user)
      .then(u => res.send(u))
      .catch(e => HttpResolver.handle(e, 'UserService#post', res));
  }

  updateInformations(req, res) {
    const user = UserFactory.forInformationsUpdate(req.body);
    return POSTGRES_DB.users.updateInformations(user)
      .then(u => res.send(u))
      .catch(e => HttpResolver.handle(e, 'UserService#updateInformations', res));
  }

  updatePassword(req, res) {
    const makeUpdateInfos = u => ({
      id: u.id,
      password: Password.hash(req.body.password)
    });

    const user = UserFactory.forPasswordUpdate(req.body);
    Password.validate(user, user.id)
      .then(() => makeUpdateInfos(user))
      .then(infos => POSTGRES_DB.users.updatePassword(infos))
      .then(() => res.send())
      .catch(e => HttpResolver.handle(e, 'UserService#updatePassword', res));
  }

}

module.exports = UsersService;
