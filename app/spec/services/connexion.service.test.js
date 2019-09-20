process.env.NODE_ENV = 'test';

const chai = require('chai');
const httpMocks = require('node-mocks-http');

const expect = chai.expect;

chai.should();
chai.use(require('chai-things'));
chai.use(require('chai-spies'));

const { ConnexionService } = require('../../src/api/connexion/connexion.service');

const { HTTP_ERROR_CODES } = require('../../src/config/errorCodes');
const { db } = require('../../src/utils/DatabaseGateway');
const HttpResolver = require('../../src/utils/HttpResolver');

describe('Connexion Service should', () => {

  const azeiopSHA1 = 'sha1$36b85417$1$83c38dd50e357914714df9e397995fa50224b2f1';
  const azeiopPassword = 'azeiop';

  const databaseGateway = {};
  let connexionService;

  const sandbox = chai.spy.sandbox();

  beforeEach(() => {
    sandbox.on(
      HttpResolver, 'handle',
      e => Promise.reject(e)
    );

    connexionService = new ConnexionService(databaseGateway);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('create', () => {
    expect(connexionService).not.to.be.undefined;
    expect(connexionService).to.exist;
  });

  it('throw error when user mail doesn\'t exist', done => {
    sandbox.on(
      db.users, 'findByMail',
      () => {
        throw new Error('error');
      }
    );

    connexionService.post({}, {})
      .catch(err => {
        expect(err).to.be.an.instanceof(Error);
        done();
      });
  });

  it('throw error when password do not match', done => {
    sandbox.on(
      db.users, 'findByMail',
      () => Promise.resolve({ password: azeiopSHA1 })
    );

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/connexion',
      body: {
        mail: 'existing mail',
        password: 'wrong password'
      }
    });

    connexionService.post(request, {})
      .catch(err => {
        expect(err.code).to.equal(HTTP_ERROR_CODES.UNAUTHORIZED);
        expect(err.message).to.contain('ConnexionController#verifyPassword');
        done();
      });
  });

  it('return signed token when connexion succeeds', done => {
    sandbox.on(
      db.users, 'findByMail',
      () => Promise.resolve({ password: azeiopSHA1 })
    );

    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/connexion',
      body: {
        mail: 'existing mail',
        password: azeiopPassword
      }
    });

    const response = httpMocks.createResponse();

    connexionService.post(request, response)
      .then(() => {
        const result = response._getData();
        expect(result.token).to.exist;
        done();
      });
  });
});
