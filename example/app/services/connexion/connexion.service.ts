import type { Request, Response } from 'express';
import { JWT } from '../../config/secret.js';
import { ROLES } from '../../config/roles.js';
import { connexionSchema } from './connexion.schema.js';
import type UsersRepository from '../../repositories/users.repository.js';
import Service from '../../../../src/nodeExpress/Service.js';
import { RouteConfig } from '../../../../src/types.js';
import Password from '../../../../src/authentication/Password.js';
import HttpResolver from '../../../../src/loggers/HttpResolver.js';
import Auth from '../../../../src/authentication/Auth.js';
import { HTTP_METHODS } from '../../../../src/nodeExpress/http-methods.config.js';


export default class ConnexionService extends Service {

  protected routesConfig: RouteConfig[] = [
    {
      route: '/connexion',
      execute: 'connexion',
      method: HTTP_METHODS.POST,
      schema: connexionSchema,
      roles: [ROLES.PUBLIC]
    }
  ];

  constructor(tokenSecret: string) {
    super(tokenSecret);
  }

  async connexion(req: Request, res: Response): Promise<void> {
    const body = req.body as { email: string; password: string };

    try {
      const user = await (this.repositories.users as UsersRepository).getByMailWithPassword(body.email);

      if (!await Password.validate(body.password, user.password)) {
        HttpResolver.unauthorized(
          `ConnexionController#verifyPassword - wrong login`,
          `wrong login`,
          res
        );
        return;
      }

      const token = Auth.sign(
        {
          roles: [user.roles as string],
          id: user.id
        },
        JWT.SECRET,
        JWT.EXPIRES_IN
      );

      res.send({ token });
    } catch (error) {
      HttpResolver.handle(error as { type: string; message: string }, `ConnexionService#connexion`, res);
    }
  }

}
