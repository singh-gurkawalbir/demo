export default {
  fieldMap: {
    'rest.refreshTokenURI': {
      fieldId: 'rest.refreshTokenURI',
    },
    'rest.refreshTokenMediaType': {
      fieldId: 'rest.refreshTokenMediaType',
    },
    'rest.refreshTokenMethod': {
      fieldId: 'rest.refreshTokenMethod',
      required: true,
    },
    'rest.refreshTokenBody': {
      fieldId: 'rest.refreshTokenBody',
      visibleWhenAll: [
        { field: 'rest.refreshTokenMethod', is: ['POST', 'PUT'] },
      ],
    },
    'rest.refreshTokenPath': {
      fieldId: 'rest.refreshTokenPath',
    },
    'rest.refreshTokenHeaders': {
      fieldId: 'rest.refreshTokenHeaders',
    },
  },
  layout: {
    fields: [
      'rest.refreshTokenMethod',
      'rest.refreshTokenURI',
      'rest.refreshTokenHeaders',
      'rest.refreshTokenMediaType',
      'rest.refreshTokenBody',
      'rest.refreshTokenPath',
    ],
  },
};

