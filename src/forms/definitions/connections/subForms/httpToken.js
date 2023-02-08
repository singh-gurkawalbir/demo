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
        { field: 'http.auth.token.scheme', isNot: ['Bearer', 'MAC', ' '] },
      ],
      required: true,
      defaultValue: r => {
        if (!r?.http?.auth?.token?.scheme) return '';
        // custom auth scheme gets saved in 'scheme' field
        if (['Bearer', 'MAC', ' '].includes(r.http.auth.token.scheme)) return '';

        return r.http.auth.token.scheme;
      },
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
      // Refresh token is mandatory when Configure refresh token is enabled, hence we check if this value is provided or not
      defaultValue: r => !!(r?.http?.auth?.token?.refreshToken),
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
