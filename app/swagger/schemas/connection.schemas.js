const Login = {
  type: 'object',
  properties: {
    mail: {
      type: 'string'
    },
    password: {
      type: 'string',
      format: 'password'
    }
  }
};

const ConnectionSchemas = {
  Login: Login
};

module.exports = ConnectionSchemas;
