export default {
  fieldMap: {
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      label: 'Token',
      defaultValue: '',
      required: true,
    },
    'rest.tokenLocation': { fieldId: 'rest.tokenLocation', required: true },
    'rest.authHeader': {
      fieldId: 'rest.authHeader',
      visibleWhenAll: [{ field: 'rest.tokenLocation', is: ['header'] }],
      defaultValue: r => (r && r.rest && r.rest.authHeader) || 'Authorization',
      required: true,
    },
    'rest.authScheme': {
      fieldId: 'rest.authScheme',
      visibleWhenAll: [{ field: 'rest.tokenLocation', is: ['header'] }],
      defaultValue: r => (r && r.rest && r.rest.authScheme) || ' ',
    },
    'rest.tokenParam': {
      fieldId: 'rest.tokenParam',
      visibleWhenAll: [{ field: 'rest.tokenLocation', is: ['url'] }],
      defaultValue: r => r?.rest?.tokenParam || 'access_token',
    },
    configureTokenRefresh: {
      id: 'configureTokenRefresh',
      type: 'checkbox',
      label: 'Configure refresh token',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
      ],
      defaultValue: r => !!(r && r.rest && r.rest.refreshTokenURI),
    },
  },
  layout: {
    fields: [
      'rest.bearerToken',
      'rest.tokenLocation',
      'rest.authHeader',
      'rest.authScheme',
      'rest.tokenParam',
      'configureTokenRefresh',
    ],
  },
};
