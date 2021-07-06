export default {
  fieldMap: {
    'http.auth.token.refreshToken': {
      fieldId: 'http.auth.token.refreshToken',
    },
    'http.auth.token.refreshRelativeURI': {
      fieldId: 'http.auth.token.refreshRelativeURI',
    },
    'http.auth.token.refreshMediaType': {
      fieldId: 'http.auth.token.refreshMediaType',
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
      'http.auth.token.refreshToken',
      'http.auth.token.refreshMethod',
      'http.auth.token.refreshRelativeURI',
      'http.auth.token.refreshHeaders',
      'http.auth.token.refreshMediaType',
      'http.auth.token.refreshBody',
      'http.auth.token.refreshTokenPath',
    ],
  },
};
