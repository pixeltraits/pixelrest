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
    prenom: {
      type: 'string'
    },
    nom: {
      type: 'string'
    },
    mail: {
      type: 'string'
    },
    role: {
      type: 'string'
    },
    status: {
      type: 'boolean'
    }
  }
};

const UserToCreate = {
  type: 'object',
  properties: {
    prenom: {
      type: 'string'
    },
    nom: {
      type: 'string'
    },
    mail: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    role: {
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
    prenom: {
      type: 'string'
    },
    nom: {
      type: 'string'
    },
    mail: {
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
  Token: Token,
  User: User,
  UserToCreate: UserToCreate,
  UserInformations: UserInformations,
  UserPassword: UserPassword
};

module.exports = UsersSchemas;
