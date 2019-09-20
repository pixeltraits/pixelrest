const Auth = require('../../../utils/Auth');
const HttpResolver = require('../../../utils/HttpResolver');
const Service = require('../../../utils/Service');

const HTTP_METHODS = require('../../config/http-methods');
const ROLES = require('../../constants/roles');
const { HTTP_ERROR_CODES } = require('../../constants/errorCodes');

const ConnexionController = require('../../controllers/connexion.controller');
const loginSchema = require('./connexion.schema');
const POSTGRES_DB = require('../../config/postgresDb');

class ConnexionService extends Service {

  initRoute() {
    this.routesConfig = [{
      route: '/connexion',
      execute: 'post',
      method: HTTP_METHODS.POST,
      schema: loginSchema,
      roles: [ROLES.PUBLIC]
    }];
  }

  async post(req, res) {
    const login = {
      mail: req.body.mail,
      password: req.body.password
    };

    try {
      const user = await POSTGRES_DB.users.findByMail(login.mail);

      if (!await ConnexionController.validate(login.password, user.password)) {
        return HttpResolver.handle(
          {
            code: HTTP_ERROR_CODES.UNAUTHORIZED,
            message: 'ConnexionController#verifyPassword - passwords do not match'
          },
          'ConnexionService#post',
          res
        );
      }

      const token = Auth.sign({
        roles: [user.role],
        id: user.id
      });
      return res.send({ token: token });
    } catch (error) {
      return HttpResolver.handle(error, 'ConnexionService#post', res);
    }
  }
}

module.exports = ConnexionService;
