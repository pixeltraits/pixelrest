const connect = {
  post: {
    tags: ['connect'],
    summary: 'Login utilisateur',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Login'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Token'
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

const ConnectionPaths = {
  '/connexion': connect
};

module.exports = ConnectionPaths;
