import type { Request, Response } from 'express';

import { ROLES } from '../../config/roles.js';
import {
  getByIdSchema,
  addSchema,
  updateInformationsSchema,
  updatePasswordSchema
} from './users.schema.js';
import { RouteConfig } from '../../../../src/types.js';
import Service from '../../../../src/nodeExpress/Service.js';
import HttpResolver from '../../../../src/loggers/HttpResolver.js';
import Password from '../../../../src/authentication/Password.js';
import { HTTP_METHODS } from '../../../../src/nodeExpress/http-methods.config.js';


export default class UsersService extends Service {

  routesConfig: RouteConfig[] = [
    {
      route: '/users',
      execute: 'getAll',
      method: HTTP_METHODS.GET,
      schema: null,
      roles: [ROLES.ADMIN]
    },
    {
      route: '/users/current',
      execute: 'getCurrent',
      method: HTTP_METHODS.GET,
      schema: null,
      roles: [ROLES.ADMIN]
    },
    {
      route: '/users/:id',
      execute: 'getById',
      method: HTTP_METHODS.GET,
      schema: getByIdSchema,
      roles: [ROLES.ADMIN]
    },
    {
      route: '/users',
      execute: 'add',
      method: HTTP_METHODS.POST,
      schema: addSchema,
      roles: [ROLES.PUBLIC]
    },
    {
      route: '/users/update-info',
      execute: 'updateInformations',
      method: HTTP_METHODS.PUT,
      schema: updateInformationsSchema,
      roles: [ROLES.ADMIN]
    },
    {
      route: '/users/update-pass',
      execute: 'updatePassword',
      method: HTTP_METHODS.PUT,
      schema: updatePasswordSchema,
      roles: [ROLES.ADMIN]
    }
  ];

  constructor(tokenSecret: string) {
    super(tokenSecret);
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.repositories.users.getAll();
      res.send(users);
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, `UsersService#getAll`, res);
    }
  }

  async getCurrent(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.repositories.users.getById(req.tokenData!.id);
      res.send(user);
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, `UsersService#getCurrent`, res);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.repositories.users.getById(req.params.id);
      res.send(user);
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, `UsersService#getById`, res);
    }
  }

  async add(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as { firstname: string; lastname: string; email: string; password: string; roles: string };
      const userSend = {
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email,
        password: await Password.hash(body.password),
        roles: body.roles
      };
      const userId = await this.repositories.users.add(userSend);
      const savedUser = await this.repositories.users.getById(userId!);

      res.send(savedUser);
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, `UsersService#add`, res);
    }
  }

  async updateInformations(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as { id: number; firstname: string; lastname: string; email: string };
      const user = {
        id: body.id,
        firstname: body.firstname,
        lastname: body.lastname,
        email: body.email
      };
      await this.repositories.users.updateInformations(user);
      const updatedUser = await this.repositories.users.getById(user.id);

      res.send(updatedUser);
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, `UsersService#updateInformations`, res);
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body as { id: number; password: string; oldPassword: string };
      const sendUser = {
        id: body.id,
        password: body.oldPassword,
        newPassword: body.password
      };
      const actualUser = await this.repositories.users.getPasswordById(sendUser.id);

      if (await Password.validate(sendUser.password, actualUser.password)) {
        await this.repositories.users.updatePassword({
          id: sendUser.id,
          password: await Password.hash(sendUser.newPassword)
        });
      } else {
        HttpResolver.unauthorized(
          `UsersService#updatePassword`,
          `passwords not match`,
          res
        );
        return;
      }

      res.send();
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, `UsersService#updatePassword`, res);
    }
  }

}
