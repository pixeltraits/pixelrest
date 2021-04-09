import Auth from 'pixelrest/auth';
import HttpResolver from 'pixelrest/httpResolver';
import Service from 'pixelrest/service';
import Password from 'pixelrest/password';

import { JWT } from '../../config/secret.js';
import { ROLES } from '../../config/roles.js';
import { connexionSchema } from './connexion.schema.js';


export default class ConnexionService extends Service {

  initRoute() {
    this.routesConfig = [
      {
        route: '/connexion',
        execute: 'connexion',
        method: this.HTTP_METHODS.POST,
        schema: connexionSchema,
        roles: [ROLES.PUBLIC]
      }
    ];
  }

  async connexion(req, res) {
    const login = {
      email: req.body.email,
      password: req.body.password
    };

    try {
      const user = await this.repositories.users.getByMailWithPassword(login.email);

      if (!await Password.validate(login.password, user.password)) {
        return HttpResolver.unauthorized(
          `ConnexionController#verifyPassword - wrong login`,
          `wrong login`,
          res
        );
      }

      const token = Auth.sign(
        {
          roles: [user.roles],
          id: user.id
        },
        JWT.SECRET,
        JWT.EXPIRES_IN
      );

      return res.send({ token: token });
    } catch (error) {
      return HttpResolver.handle(error, `ConnexionService#connexion`, res);
    }
  }

}
