export const Login = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      maxLength: 100
    },
    password: {
      type: 'string',
      format: 'password',
      minLength: 8,
      maxLength: 255
    }
  }
};
