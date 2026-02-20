import { Request, Response } from 'express';
import { JWT } from '../../config/secret.js';
import { ROLES } from '../../config/roles.js';
import { connexionSchema } from './connexion.schema.js';
import UsersRepository from '../../repositories/users.repository.js';
import { RouteConfig } from 'pixelrest/types';
import { HTTP_METHODS } from 'pixelrest/httpMethods';
import Service from 'pixelrest/service';
import Password from 'pixelrest/password';
import HttpResolver from 'pixelrest/httpResolver';
import Auth from 'pixelrest/auth';


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
    this.initRoutes();
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
