import HttpResolver from 'node-rest/httpResolver';
import Service from 'node-rest/service';
import Password from 'node-rest/password';

import { ROLES } from '../../config/roles.js';
import {
  getByIdSchema,
  addSchema,
  updateInformationsSchema,
  updatePasswordSchema
} from './users.schema.js';


export default class UsersService extends Service {

  initRoute() {
    this.routesConfig = [
      {
        route: '/users',
        execute: 'getAll',
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
        schema: getByIdSchema,
        roles: [ROLES.ADMIN]
      },
      {
        route: '/users',
        execute: 'add',
        method: this.HTTP_METHODS.POST,
        schema: addSchema,
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

  async getAll(req, res) {
    try {
      const users = await this.repositories.users.getAll();
      res.send(users);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UsersService#getAll`,
        res
      );
    }
  }

  async getCurrent(req, res) {
    try {
      const user = await this.repositories.users.getById(this.tokenData.id);
      res.send(user);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UsersService#getCurrent`,
        res
      );
    }
  }

  async getById(req, res) {
    try {
      const user = await this.repositories.users.getById(req.params.id);
      res.send(user);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UsersService#getById`,
        res
      );
    }
  }

  async add(req, res) {
    try {
      const userSend = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: await Password.hash(req.body.password),
        roles: req.body.roles
      };
      const userId = await this.repositories.users.add(userSend);
      const savedUser = await this.repositories.users.getById(userId);

      res.send(savedUser);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UsersService#add`,
        res
      );
    }
  }

  async updateInformations(req, res) {
    try {
      const user = {
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email
      };
      await this.repositories.users.updateInformations(user);
      const updatedUser = await this.repositories.users.getById(user.id);

      res.send(updatedUser);
    } catch (error) {
      HttpResolver.handle(
        error,
        `UsersService#updateInformations`,
        res
      );
    }
  }

  async updatePassword(req, res) {
    try {
      const sendUser = {
        id: req.body.id,
        password: req.body.oldPassword,
        newPassword: req.body.password
      };
      const actualUser = await this.repositories.users.getPasswordById(sendUser.id);

      if (await Password.validate(sendUser.password, actualUser.password)) {
        await this.repositories.users.updatePassword({
          id: sendUser.id,
          password: await Password.hash(sendUser.newPassword)
        });
      } else {
        return HttpResolver.unauthorized(
          `UsersService#updatePassword`,
          `passwords parse not match`,
          res
        );
      }

      return res.send();
    } catch (error) {
      return HttpResolver.handle(
        error,
        `UsersService#updatePassword`,
        res
      );
    }
  }

}
