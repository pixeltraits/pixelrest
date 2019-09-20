const Auth = require('../../../utils/Auth');
const HttpResolver = require('../../../utils/HttpResolver');
const Service = require('../../../utils/Service');

const POSTGRES_DB = require('../../config/postgresDb');
const HTTP_METHODS = require('../../config/http-methods');
const { HTTP_ERROR_CODES } = require('../../constants/errorCodes');
const ROLES = require('../../constants/roles');

const {
  getUserSchema,
  postUserSchema,
  updateInformationsSchema,
  updatePasswordSchema
} = require('./user.schema');

const ConnexionController = require('../../controllers/connexion.controller');

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
        roles: [ROLES.ADMIN]
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
      const users = await db.users.findAll();
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
      const user = await db.users.findById(id || req.params.id);
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
        mail: req.body.mail,
        password: await ConnexionController.hash(req.body.password),
        role: req.body.role
      };
      const userSaved = await db.users.add(userSend);

      res.send(userSaved);
    } catch (error) {
      HttpResolver.handle(error, 'UserService#post', res);
    }
  }

  async updateInformations(req, res) {
    const user = {
      id: req.body.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail
    };

    try {
      const updatedUser = await db.users.updateInformations(user);
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
      const actualUser = await db.users.findPasswordById(sendUser.id);

      if (await ConnexionController.validate(sendUser.password, actualUser.password)) {
        await db.users.updatePassword({
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
