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
  properties: {
    fileDocument: {
      type: 'string',
      format: 'binary'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    }
  }
};
