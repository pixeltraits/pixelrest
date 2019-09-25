const Auth = require('../../../utils/authentication/Auth');
const HttpResolver = require('../../../utils/loggers/HttpResolver');
const Service = require('../../../utils/nodeExpress/Service');

const HTTP_METHODS = require('../../config/http-methods');
const ROLES = require('../../constants/roles');
const { HTTP_ERROR_CODES } = require('../../constants/errorCodes');

const ConnexionController = require('../../../utils/authentication/Password');
const loginSchema = require('./connexion.schema');
const REPOSITORIES = require('../../config/postgresDb');

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
      email: req.body.email,
      password: req.body.password
    };

    try {
      const user = await REPOSITORIES.users.findByMail(login.email);

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

      return res.send({
        token: token
      });
    } catch (error) {
      return HttpResolver.handle(error, 'ConnexionService#post', res);
    }
  }
}

module.exports = ConnexionService;
