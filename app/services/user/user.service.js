import Auth from 'node-rest/auth';
import HttpResolver from 'node-rest/httpResolver';
import Service from 'node-rest/service';
import Password from 'node-rest/password';

import { JWT } from '../../config/secret.js';
import { ROLES } from '../../config/roles.js';
import {
  getUserSchema,
  postUserSchema,
  updateInformationsSchema,
  updatePasswordSchema
} from './user.schema.js';


export default class UserService extends Service {

  initRoute() {
    this.routesConfig = [
      {
        route: '/users',
        execute: 'get',
        method: this.HTTP_METHODS.GET,
        schema: null,
        roles: [ROLES.ADMIN]
      },
      {
        route: '/users/current',
        execute: 'getCurrent',
        method: this.HTTP_METHODS.GET,
        schema: null,
        roles: [ROLES.ADMIN]
      },
      {
        route: '/users/:id',
        execute: 'getById',
        method: this.HTTP_METHODS.GET,
        schema: getUserSchema,
        roles: [ROLES.ADMIN]
      },
      {
        route: '/users',
        execute: 'post',
        method: this.HTTP_METHODS.POST,
        schema: postUserSchema,
        roles: [ROLES.PUBLIC]
      },
      {
        route: '/users/update-info',
        execute: 'updateInformations',
        method: this.HTTP_METHODS.PUT,
        schema: updateInformationsSchema,
        roles: [ROLES.ADMIN]
      },
      {
        route: '/users/update-pass',
        execute: 'updatePassword',
        method: this.HTTP_METHODS.PUT,
        schema: updatePasswordSchema,
        roles: [ROLES.ADMIN]
      }
    ];
  }

  async get(req, res) {
    try {
      const users = await this.db.users.findAll();
      res.send(users);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UserService#get`,
        res
      );
    }
  }

  async getCurrent(req, res) {
    const token = Auth.verify(req.headers.authorization, JWT.SECRET);

    if (!token || !token.id) {
      return HttpResolver.handle(
        new Error(`Invalid token - missing id`),
        `UserService#getCurrent`,
        res
      );
    }

    return this.getById(req, res, token.id);
  }

  async getById(req, res) {
    try {
      const user = await this.db.users.findById(req.params.id);
      res.send(user);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UserService#getEvenementById`,
        res
      );
    }
  }

  async post(req, res) {
    try {
      const userSend = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: await Password.hash(req.body.password),
        roles: req.body.roles
      };
      await this.db.users.add(userSend);
      const savedUser = await this.db.users.findByMail(userSend.email);

      res.send(savedUser);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UserService#post`,
        res
      );
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
      const updatedUserId = await this.db.users.updateInformations(user);
      const updatedUser = await this.db.users.findById(updatedUserId);

      res.send(updatedUser);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UserService#updateInformations`,
        res
      );
    }
  }

  async updatePassword(req, res) {
    const sendUser = {
      id: req.body.id,
      password: req.body.oldPassword,
      newPassword: req.body.password
    };

    try {
      const actualUser = await this.db.users.findPasswordById(sendUser.id);

      if (await Password.validate(sendUser.password, actualUser.password)) {
        await this.db.users.updatePassword({
          id: sendUser.id,
          password: await Password.hash(sendUser.newPassword)
        });
      } else {
        return HttpResolver.unauthorized(
          new Date().getTime(),
          `ConnexionService#verifyPassword`,
          `passwords parse not match`,
          res
        );
      }

      return res.send();
    } catch (error) {
      return HttpResolver.handle(
        error,
        `UserService#updatePassword`,
        res
      );
    }
  }

}
