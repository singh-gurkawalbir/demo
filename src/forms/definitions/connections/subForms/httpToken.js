export default {
  fieldMap: {
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Token',
      defaultValue: '',
      required: true,
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['token'] },
      ],
    },
    'http.auth.token.location': {
      fieldId: 'http.auth.token.location',
      required: true,
    },
    'http.auth.token.headerName': {
      fieldId: 'http.auth.token.headerName',
      visibleWhenAll: [{ field: 'http.auth.token.location', is: ['header'] }],
      required: true,
    },
    'http.auth.token.scheme': {
      fieldId: 'http.auth.token.scheme',
      visibleWhenAll: [{ field: 'http.auth.token.location', is: ['header'] }],
    },
    'http.customAuthScheme': {
      id: 'http.customAuthScheme',
      type: 'text',
      label: 'Custom auth scheme',
      visibleWhenAll: [
        { field: 'http.auth.token.location', is: ['header'] },
        { field: 'http.auth.token.scheme', is: ['Custom'] },
      ],
      required: true,
    },
    'http.auth.token.paramName': {
      fieldId: 'http.auth.token.paramName',
      visibleWhenAll: [{ field: 'http.auth.token.location', is: ['url'] }],
      defaultValue: r => r?.http?.auth?.token?.paramName || 'access_token',
    },
    configureTokenRefresh: {
      id: 'configureTokenRefresh',
      type: 'checkbox',
      label: 'Configure refresh token',
      defaultValue: r =>
        !!(
          r &&
          r.http &&
          r.http.auth &&
          r.http.auth.token &&
          r.http.auth.token.refreshRelativeURI
        ),
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'http.auth.type', is: ['token'] },
      ],
    },
  },
  layout: {
    fields: [
      'http.auth.token.token',
      'http.auth.token.location',
      'http.auth.token.headerName',
      'http.auth.token.scheme',
      'http.customAuthScheme',
      'http.auth.token.paramName',
      'configureTokenRefresh',
    ],
  },
};
