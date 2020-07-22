export default {
  preSave: (formValues) => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'concurinvoice',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/oauth/grantType': 'password',
    '/http/auth/oauth/authURI': `https://${
      formValues['/http/baseURI']
    }/oauth2/v0/authorize`,
    '/http/auth/oauth/tokenURI': `https://${
      formValues['/http/baseURI']
    }/oauth2/v0/token`,
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.username': {
      id: 'http.auth.oauth.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'concurinvoice.connection.http.unencrypted.username',
    },
    'http.auth.oauth.password': {
      id: 'http.auth.oauth.password',
      type: 'text',
      label: 'Password',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpKey: 'concurinvoice.connection.http.encrypted.password',
      description:
            'Note: for security reasons this field must always be re-entered.',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.auth.oauth.username', is: [''] },
        { field: 'http.auth.oauth.password', is: [''] },
      ],
      label: 'Generate token',
      defaultValue: '',
      required: true,
    },
    'http.auth.token.refreshToken': {
      id: 'http.auth.token.refreshToken',
      type: 'text',
      visible: false,
    },
    'http.baseURI': {
      id: 'http.baseURI',
      type: 'text',
      visible: false,
    },
    'http.unencrypted.edition': {
      id: 'http.unencrypted.edition',
      type: 'text',
      visible: false,
    },
    'http.unencrypted.refreshTokenExpiresAt': {
      id: 'http.unencrypted.refreshTokenExpiresAt',
      type: 'text',
      visible: false,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.oauth.username',
      'http.auth.oauth.password',
      'http.auth.token.token',
      'http.auth.token.refreshToken',
      'http.baseURI',
      'http.unencrypted.edition',
      'http.unencrypted.refreshTokenExpiresAt',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'save',
      label: 'Save',
    }
  ]
};
