export default {
  fieldMap: {
    'http.auth.token.refreshRelativeURI': {
      fieldId: 'http.auth.token.refreshRelativeURI',
    },
    'rest.refreshTokenMediaType': {
      fieldId: 'rest.refreshTokenMediaType',
    },
    'http.auth.token.refreshMethod': {
      fieldId: 'http.auth.token.refreshMethod',
      required: true,
    },
    'http.auth.token.refreshBody': {
      fieldId: 'http.auth.token.refreshBody',
      visibleWhenAll: [
        { field: 'http.auth.token.refreshMethod', is: ['POST', 'PUT'] },
      ],
    },
    'http.auth.token.refreshTokenPath': {
      fieldId: 'http.auth.token.refreshTokenPath',
    },
    'http.auth.token.refreshHeaders': {
      fieldId: 'http.auth.token.refreshHeaders',
    },
  },
  layout: {
    fields: [
      'http.auth.token.refreshMethod',
      'http.auth.token.refreshRelativeURI',
      'http.auth.token.refreshHeaders',
      'rest.refreshTokenMediaType',
      'http.auth.token.refreshBody',
      'http.auth.token.refreshTokenPath',
    ],
  },
};

