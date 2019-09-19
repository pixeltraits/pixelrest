const Auth = require('../../../utils/Auth');
const HttpResolver = require('../../../utils/HttpResolver');
const Service = require('../../../utils/Service');

const HTTP_METHODS = require('../../config/http-methods');
const ROLES = require('../../config/roles');
const { HTTP_ERROR_CODES } = require('../../config/errorCodes');

const ConnexionController = require('../../controllers/connexion.controller');

const loginSchema = require('./connexion.schema');

const { db } = require('../../../utils/DatabaseGateway');

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
    return db.users.findByMail(req.body.mail)
      .then(userInfos => {
        if (!ConnexionController.verifyPassword(req.body.password, userInfos.password)) {
          throw {
            code: HTTP_ERROR_CODES.UNAUTHORIZED,
            message: 'ConnexionController#verifyPassword - passwords do not match'
          };
        }
        return userInfos;
      })
      .then(userInfos => {
        const token = Auth.sign({ roles: [userInfos.role], id: userInfos.id });
        res.send({ token: token });
      })
      .catch(e => HttpResolver.handle(e, 'ConnexionService#post', res));
  }
}

module.exports = {
  ConnexionService: ConnexionService
};
