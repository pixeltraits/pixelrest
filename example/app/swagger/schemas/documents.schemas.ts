export const Document = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      format: 'int64'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    filename: {
      type: 'string'
    }
  }
};

export const DocumentToAdd = {
  type: 'object',
  required: ['fileDocument', 'name', 'description'],
  properties: {
    fileDocument: {
      type: 'string',
      format: 'binary'
    },
    name: {
      type: 'string',
      maxLength: 100
    },
    description: {
      type: 'string',
      maxLength: 500
    }
  }
};
