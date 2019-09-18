const findAll = {
  get: {
    tags: ['users'],
    summary: 'Renvoie tous les utilisateurs',
    security: [{
      bearerAuth: []
    }],
    responses: {
      200: {
        description: 'Une liste d\'utilisateurs',
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
    summary: 'Renvoie l\'utilisateur actuel',
    security: [{
      bearerAuth: []
    }],
    responses: {
      200: {
        description: 'Un utilisateur',
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

const findDepartementPreferes = {
  get: {
    tags: ['users'],
    summary: 'Renvoie les ids des départements préférés d\'un utilisateur',
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
        description: 'Une liste d\'id de département',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'string'
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

const findById = {
  get: {
    tags: ['users'],
    summary: 'Renvoie un utilisateur par ID',
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
        description: 'Un utilisateur',
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
    summary: 'Ajout d\'utilisateur',
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
    summary: 'Mise à jour des informations',
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
        description: 'Un utilisateur mis à jour',
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
    summary: 'Mise à jour du mot de passe',
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

const UsersPaths = {
  '/users': { ...findAll, ...create },
  '/users/current': findCurrent,
  '/users/{id}/departements': findDepartementPreferes,
  '/users/{id}': findById,
  '/users/update-info': updateInformations,
  '/users/update-pass': updatePassword
};

module.exports = UsersPaths;
