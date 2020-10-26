const findAll = {
  get: {
    tags: ['users'],
    summary: 'Get all users',
    security: [{
      bearerAuth: []
    }],
    responses: {
      200: {
        description: 'All users',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      },
      401: {
        description: 'Unauthorized'
      },
      500: {
        description: 'Unexpected error'
      }
    }
  }
};

const findCurrent = {
  get: {
    tags: ['users'],
    summary: 'Get current user',
    security: [{
      bearerAuth: []
    }],
    responses: {
      200: {
        description: 'User informations',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      },
      500: {
        description: 'Unexpected error'
      }
    }
  }
};

const findById = {
  get: {
    tags: ['users'],
    summary: 'Get user by ID',
    security: [{
      bearerAuth: []
    }],
    parameters: [{
      name: 'id',
      in: 'path',
      required: true,
      type: 'integer',
      format: 'int64'
    }],
    responses: {
      200: {
        description: 'User informations',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/User'
            }
          }
        }
      },
      401: {
        description: 'Unauthorized'
      },
      500: {
        description: 'Unexpected error'
      }
    }
  }
};

const create = {
  post: {
    tags: ['users'],
    summary: 'Add user',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserToCreate'
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Created'
      },
      401: {
        description: 'Unauthorized'
      },
      500: {
        description: 'Unexpected error'
      }
    }
  }
};

const updateInformations = {
  put: {
    tags: ['users'],
    summary: 'Update user',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserInformations'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'User updated',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserInformations'
            }
          }
        }
      },
      401: {
        description: 'Unauthorized'
      },
      500: {
        description: 'Unexpected error'
      }
    }
  }
};

const updatePassword = {
  put: {
    tags: ['users'],
    summary: 'Update password',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UserPassword'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Un utilisateur mis à jour',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserStatus'
            }
          }
        }
      },
      401: {
        description: 'Unauthorized'
      },
      500: {
        description: 'Unexpected error'
      }
    }
  }
};

export default {
  '/users': { ...findAll, ...create },
  '/users/current': findCurrent,
  '/users/{id}': findById,
  '/users/update-info': updateInformations,
  '/users/update-pass': updatePassword
};
