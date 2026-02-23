export const Token = {
  type: 'object',
  properties: {
    token: {
      type: 'string'
    }
  }
};

export const User = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      format: 'int64'
    },
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    roles: {
      type: 'string'
    }
  }
};

export const UserToCreate = {
  type: 'object',
  required: ['firstname', 'lastname', 'email', 'password', 'roles'],
  properties: {
    firstname: {
      type: 'string',
      maxLength: 50
    },
    lastname: {
      type: 'string',
      maxLength: 50
    },
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
    },
    roles: {
      type: 'string'
    }
  }
};

export const UserInformations = {
  type: 'object',
  required: ['id', 'firstname', 'lastname', 'email'],
  properties: {
    id: {
      type: 'integer',
      format: 'int64'
    },
    firstname: {
      type: 'string',
      maxLength: 50
    },
    lastname: {
      type: 'string',
      maxLength: 50
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 100
    }
  }
};

export const UserPassword = {
  type: 'object',
  required: ['id', 'password', 'oldPassword'],
  properties: {
    id: {
      type: 'integer',
      format: 'int64'
    },
    password: {
      type: 'string',
      format: 'password',
      minLength: 8,
      maxLength: 255
    },
    oldPassword: {
      type: 'string',
      format: 'password',
      minLength: 8,
      maxLength: 255
    }
  }
};
