const Token = {
  type: 'object',
  properties: {
    token: {
      type: 'string'
    }
  }
};

const User = {
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

const UserToCreate = {
  type: 'object',
  properties: {
    firstname: {
      type: 'string'
    },
    lastname: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    roles: {
      type: 'string'
    }
  }
};

const UserInformations = {
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
    }
  }
};

const UserPassword = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      format: 'int64'
    },
    password: {
      type: 'string'
    },
    oldPassword: {
      type: 'string'
    }
  }
};

const UsersSchemas = {
  Token,
  User,
  UserToCreate,
  UserInformations,
  UserPassword
};

module.exports = UsersSchemas;
