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

export const UserInformations = {
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

export const UserPassword = {
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
