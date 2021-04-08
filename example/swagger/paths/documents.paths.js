const add = {
  post: {
    tags: ['documents'],
    summary: 'Add document',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      content: {
        'multipart/form-data': {
          schema: {
            $ref: '#/components/schemas/DocumentToAdd'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Document added',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Document'
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
  '/documents': add
};
