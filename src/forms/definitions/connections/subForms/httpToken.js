export default {
  fieldMap: {
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Token',
      defaultValue: '',
      required: true,
    },
    tokenHeader: {
      id: 'tokenHeader',
      label: 'How to send token?',
      type: 'labeltitle',
    },
    'http.auth.token.location': {
      fieldId: 'http.auth.token.location',
      required: true,
    },
    'http.auth.token.headerName': {
      fieldId: 'http.auth.token.headerName',
      visibleWhenAll: [{ field: 'http.auth.token.location', is: ['header'] }],
    },
    'http.auth.token.scheme': {
      fieldId: 'http.auth.token.scheme',
      visibleWhenAll: [{ field: 'http.auth.token.location', is: ['header'] }],
    },
    'http.customAuthScheme': {
      id: 'http.customAuthScheme',
      type: 'text',
      label: 'Custom Auth Scheme',
      visibleWhenAll: [
        { field: 'http.auth.token.location', is: ['header'] },
        { field: 'http.auth.token.scheme', is: ['Custom'] },
      ],
    },
    'http.auth.token.paramName': {
      fieldId: 'http.auth.token.paramName',
      visibleWhenAll: [{ field: 'http.auth.token.location', is: ['url'] }],
    },
    configureTokenRefresh: {
      fieldId: 'configureTokenRefresh',
      type: 'checkbox',
      label: 'Configure Token Refresh',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    refreshTokenHeader: {
      id: 'refreshTokenHeader',
      label: 'How to Refresh Token?',
      type: 'labeltitle',
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'http.auth.token.refreshToken': {
      fieldId: 'http.auth.token.refreshToken',
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'http.auth.token.refreshRelativeURI': {
      fieldId: 'http.auth.token.refreshRelativeURI',
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'http.auth.token.refreshMediaType': {
      fieldId: 'http.auth.token.refreshMediaType',
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'http.auth.token.refreshMethod': {
      fieldId: 'http.auth.token.refreshMethod',
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'http.auth.token.refreshBody': {
      fieldId: 'http.auth.token.refreshBody',
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
        { field: 'http.auth.token.refreshMethod', is: ['POST', 'PUT'] },
      ],
    },
    'http.auth.token.refreshTokenPath': {
      fieldId: 'http.auth.token.refreshTokenPath',
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    'http.auth.token.refreshHeaders': {
      fieldId: 'http.auth.token.refreshHeaders',
      visibleWhenAll: [
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
  },
  layout: {
    fields: [
      'http.auth.token.token',
      'tokenHeader',
      'http.auth.token.location',
      'http.auth.token.headerName',
      'http.auth.token.scheme',
      'http.customAuthScheme',
      'http.auth.token.paramName',
      'configureTokenRefresh',
      'refreshTokenHeader',
      'http.auth.token.refreshToken',
      'http.auth.token.refreshRelativeURI',
      'http.auth.token.refreshMediaType',
      'http.auth.token.refreshMethod',
      'http.auth.token.refreshBody',
      'http.auth.token.refreshTokenPath',
      'http.auth.token.refreshHeaders',
    ],
  },
};
