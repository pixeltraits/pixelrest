import Auth from 'node-rest/auth';
import HttpResolver from 'node-rest/httpResolver';
import Service from 'node-rest/service';
import Password from 'node-rest/password';

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
      const user = await this.db.users.findByMail(login.email);

      console.log(login.password, user.password)
      if (!await Password.validate(login.password, user.password)) {
        return HttpResolver.unauthorized(
          new Date().getTime(),
          `ConnexionController#verifyPassword - passwords parse not match`,
          `passwords parse not match`,
          res
        );
      }

      const token = Auth.sign(
        {
          roles: [user.role],
          id: user.id
        },
        JWT.SECRET,
        JWT.EXPIRES_IN
      );

      return res.send({ token: token });
    } catch (error) {
      return HttpResolver.handle(error, `ConnexionService#post`, res);
    }
  }

}
