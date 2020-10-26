const connection = {
  post: {
    tags: ['connect'],
    summary: 'Login',
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

export default {
  '/connexion': connection
};
