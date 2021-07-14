export default {
  fieldMap: {
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Token',
      defaultValue: '',
      required: true,
    },
    'rest.tokenLocation': { fieldId: 'rest.tokenLocation', required: true },
    'http.auth.token.headerName': {
      fieldId: 'http.auth.token.headerName',
      visibleWhenAll: [{ field: 'http.auth.token.location', is: ['header'] }],
      defaultValue: r => r?.http?.auth?.headerName || 'Authorization',
      required: true,
    },
    'rest.authScheme': {
      fieldId: 'rest.authScheme',
      visibleWhenAll: [{ field: 'rest.tokenLocation', is: ['header'] }],
      defaultValue: r => r?.http?.auth?.token?.scheme || ' ',
    },
    'http.auth.token.paramName': {
      fieldId: 'http.auth.token.paramName',
      visibleWhenAll: [{ field: 'rest.tokenLocation', is: ['url'] }],
      defaultValue: r => r?.http?.auth?.token?.paramName || 'access_token',
    },
    configureTokenRefresh: {
      id: 'configureTokenRefresh',
      type: 'checkbox',
      label: 'Configure refresh token',
      visibleWhenAll: [
        { field: 'rest.tokenLocation', isNot: [''] },
      ],
      defaultValue: r => !!r?.http?.auth?.token?.refreshRelativeURI,
    },
  },
  layout: {
    fields: [
      'http.auth.token.token',
      'rest.tokenLocation',
      'http.auth.token.headerName',
      'rest.authScheme',
      'http.auth.token.paramName',
      'configureTokenRefresh',
    ],
  },
};
