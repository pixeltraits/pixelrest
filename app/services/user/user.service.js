const Auth = require('../../../utils/authentication/Auth');
const HttpResolver = require('../../../utils/loggers/HttpResolver');
const Service = require('../../../utils/nodeExpress/Service');

const REPOSITORIES = require('../../config/mysqlDb');
const HTTP_METHODS = require('../../config/http-methods');
const { HTTP_ERROR_CODES } = require('../../constants/errorCodes');
const ROLES = require('../../constants/roles');

const {
  getUserSchema,
  postUserSchema,
  updateInformationsSchema,
  updatePasswordSchema
} = require('./user.schema');

const ConnexionController = require('../../../utils/authentication/Password');

class UserService extends Service {

  initRoute() {
    this.routesConfig = [
      {
        route: '/users',
        execute: 'get',
        method: HTTP_METHODS.GET,
        schema: null,
        roles: [ROLES.ADMIN, ROLES.INTERNE, ROLES.COEXIEN, ROLES.CESARIEN, ROLES.EXTERNE]
      },
      {
        route: '/users/current',
        execute: 'getCurrent',
        method: HTTP_METHODS.GET,
        schema: null,
        roles: [ROLES.ADMIN, ROLES.INTERNE, ROLES.COEXIEN, ROLES.CESARIEN, ROLES.EXTERNE]
      },
      {
        route: '/users/:id',
        execute: 'getById',
        method: HTTP_METHODS.GET,
        schema: getUserSchema,
        roles: [ROLES.ADMIN, ROLES.INTERNE, ROLES.COEXIEN, ROLES.CESARIEN, ROLES.EXTERNE]
      },
      {
        route: '/users',
        execute: 'post',
        method: HTTP_METHODS.POST,
        schema: postUserSchema,
        roles: [ROLES.PUBLIC]
      },
      {
        route: '/users/update-info',
        execute: 'updateInformations',
        method: HTTP_METHODS.PUT,
        schema: updateInformationsSchema,
        roles: [ROLES.ADMIN, ROLES.INTERNE, ROLES.COEXIEN, ROLES.CESARIEN, ROLES.EXTERNE]
      },
      {
        route: '/users/update-pass',
        execute: 'updatePassword',
        method: HTTP_METHODS.PUT,
        schema: updatePasswordSchema,
        roles: [ROLES.ADMIN, ROLES.INTERNE, ROLES.COEXIEN, ROLES.CESARIEN, ROLES.EXTERNE]
      }
    ];
  }

  async get(req, res) {
    try {
      const users = await REPOSITORIES.users.findAll();
      res.send(users);
    } catch (error) {
      HttpResolver.handle(error, 'UserService#get', res);
    }
  }

  getCurrent(req, res) {
    const token = Auth.verify(req.headers.authorization);

    if (!token || !token.id) {
      return HttpResolver.handle(new Error('Invalid token - missing id'), 'UserService#getCurrent', res);
    }

    return this.getById(req, res, token.id);
  }

  async getById(req, res, id = null) {
    try {
      const user = await REPOSITORIES.users.findById(id || req.params.id);
      res.send(user);
    } catch (error) {
      HttpResolver.handle(error, 'UserService#getById', res);
    }
  }

  async post(req, res) {
    try {
      const userSend = {
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: await ConnexionController.hash(req.body.password),
        roles: req.body.roles
      };
      const savedUserId = await REPOSITORIES.users.add(userSend);
      const savedUser = await REPOSITORIES.users.findById(savedUserId);

      res.send(savedUser);
    } catch (error) {
      HttpResolver.handle(error, 'UserService#post', res);
    }
  }

  async updateInformations(req, res) {
    const user = {
      id: req.body.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email
    };

    try {
      const updatedUserId = await REPOSITORIES.users.updateInformations(user);
      const updatedUser = await REPOSITORIES.users.findById(updatedUserId);

      res.send(updatedUser);
    } catch (error) {
      HttpResolver.handle(error, 'UserService#updateInformations', res);
    }
  }

  async updatePassword(req, res) {
    const sendUser = {
      id: req.body.id,
      password: req.body.oldPassword,
      newPassword: req.body.password
    };

    try {
      const actualUser = await REPOSITORIES.users.findPasswordById(sendUser.id);

      if (await ConnexionController.validate(sendUser.password, actualUser.password)) {
        await REPOSITORIES.users.updatePassword({
          id: sendUser.id,
          password: await ConnexionController.hash(sendUser.newPassword)
        });
      } else {
        return HttpResolver.handle(
          {
            code: HTTP_ERROR_CODES.UNAUTHORIZED,
            message: 'ConnexionController#verifyPassword - passwords do not match'
          },
          'ConnexionService#post',
          res
        );
      }

      return res.send();
    } catch (error) {
      return HttpResolver.handle(error, 'UserService#updatePassword', res);
    }
  }
}

module.exports = UserService;
