export default {
  fieldMap: {
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      label: 'Token',
      defaultValue: '',
      required: true,
    },
    tokenHeader: {
      id: 'tokenHeader',
      label: 'How to send token?',
      type: 'labeltitle',
    },
    'rest.tokenLocation': { fieldId: 'rest.tokenLocation', required: true },
    'rest.authHeader': {
      fieldId: 'rest.authHeader',
      visibleWhenAll: [{ field: 'rest.tokenLocation', is: ['header'] }],
      defaultValue: r => (r && r.rest && r.rest.authHeader) || 'Authorization',
    },
    'rest.authScheme': {
      fieldId: 'rest.authScheme',
      visibleWhenAll: [{ field: 'rest.tokenLocation', is: ['header'] }],
      defaultValue: r => (r && r.rest && r.rest.authScheme) || 'Bearer',
    },
    'rest.tokenParam': {
      fieldId: 'rest.tokenParam',
      visibleWhenAll: [{ field: 'rest.tokenLocation', is: ['url'] }],
    },
    configureTokenRefresh: {
      fieldId: 'configureTokenRefresh',
      type: 'checkbox',
      label: 'Configure Token Refresh',
      visibleWhenAll: [{ field: 'rest.tokenLocation', isNot: [''] }],
      defaultValue: r => !!(r && r.rest && r.rest.refreshTokenURI),
    },
    refreshTokenHeader: {
      id: 'refreshTokenHeader',
      label: 'How to Refresh Token?',
      type: 'labeltitle',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'rest.refreshTokenURI': {
      fieldId: 'rest.refreshTokenURI',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'rest.refreshTokenMediaType': {
      fieldId: 'rest.refreshTokenMediaType',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'rest.refreshTokenMethod': {
      fieldId: 'rest.refreshTokenMethod',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'rest.refreshTokenBody': {
      fieldId: 'rest.refreshTokenBody',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
        { field: 'rest.refreshTokenMethod', is: ['POST', 'PUT'] },
      ],
    },
    'rest.refreshTokenPath': {
      fieldId: 'rest.refreshTokenPath',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'rest.refreshTokenHeaders': {
      fieldId: 'rest.refreshTokenHeaders',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
  },
  layout: {
    fields: [
      'rest.bearerToken',
      'tokenHeader',
      'rest.tokenLocation',
      'rest.authHeader',
      'rest.authScheme',
      'rest.tokenParam',
      'configureTokenRefresh',
      'refreshTokenHeader',
      'rest.refreshTokenURI',
      'rest.refreshTokenMediaType',
      'rest.refreshTokenMethod',
      'rest.refreshTokenBody',
      'rest.refreshTokenPath',
      'rest.refreshTokenHeaders',
    ],
  },
};
