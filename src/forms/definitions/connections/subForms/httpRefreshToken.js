// visibleWhen is not supported for subForms, hence added to each field
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
        { field: 'http.auth.token.refreshMethod', is: ['POST'] },
      ],
    },
    'http.auth.token.refreshTokenPath': {
      fieldId: 'http.auth.token.refreshTokenPath',
    },
    'http.auth.token.refreshHeaders': {
      fieldId: 'http.auth.token.refreshHeaders',
    },
    'http.auth.token.tokenPaths': {
      fieldId: 'http.auth.token.tokenPaths',
      visibleWhenAll: [
        { field: 'configureCutomAuthTokenRefresh', is: [true] },
        { field: 'http.auth.type', is: ['custom'] },
      ],
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
      'http.auth.token.tokenPaths',
    ],
  },
};
