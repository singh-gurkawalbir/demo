// visibleWhen is not supported for subForms, hence added to each field
const visibleWhen = [
  { field: 'configureTokenRefresh', is: [true] },
  { field: 'configureCutomAuthTokenRefresh', is: [true] },
];

export default {
  fieldMap: {
    'http.auth.token.refreshToken': {
      fieldId: 'http.auth.token.refreshToken',
      visibleWhen,
    },
    'http.auth.token.refreshRelativeURI': {
      fieldId: 'http.auth.token.refreshRelativeURI',
      visibleWhen,
    },
    'http.auth.token.refreshMediaType': {
      fieldId: 'http.auth.token.refreshMediaType',
      visibleWhen,
    },
    'http.auth.token.refreshMethod': {
      fieldId: 'http.auth.token.refreshMethod',
      required: true,
      visibleWhen,
    },
    'http.auth.token.refreshBody': {
      fieldId: 'http.auth.token.refreshBody',
      visibleWhenAll: [
        { field: 'http.auth.token.refreshMethod', is: ['POST'] },
      ],
      visibleWhen,
    },
    'http.auth.token.refreshTokenPath': {
      fieldId: 'http.auth.token.refreshTokenPath',
      visibleWhen,
    },
    'http.auth.token.refreshHeaders': {
      fieldId: 'http.auth.token.refreshHeaders',
      visibleWhen,
    },
    'http.auth.token.tokenPaths': {
      fieldId: 'http.auth.token.tokenPaths',
      visibleWhen,
      refreshOptionsOnChangesTo: ['http.auth.type', 'configureCutomAuthTokenRefresh', 'configureTokenRefresh'],
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
