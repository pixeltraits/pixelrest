const Login = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string',
      format: 'password'
    }
  }
};

const ConnectionSchemas = {
  Login
};

module.exports = ConnectionSchemas;