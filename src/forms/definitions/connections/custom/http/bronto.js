export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'bronto',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://rest.bronto.com/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': 'campaigns',
    '/http/auth/token/refreshRelativeURI':
      'https://auth.bronto.com/oauth2/token',
    '/http/auth/token/refreshBody':
      '{"grant_type":"client_credentials","client_id":"{{{connection.http.unencrypted.clientId}}}","client_secret":"{{{connection.http.encrypted.clientSecret}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/failStatusCode': 403,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client id',
      helpKey: 'bronto.connection.http.unencrypted.clientId',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Client secret',
      inputType: 'password',
      helpKey: 'bronto.connection.http.encrypted.clientSecret',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.clientId', is: [''] },
        { field: 'http.encrypted.clientSecret', is: [''] },
      ],
      label: 'Generate token',
      defaultValue: '',
      required: true,
      helpKey: 'bronto.connection.http.auth.token.token',
    },
    'http.auth.token.refreshToken': {
      fieldId: 'http.auth.token.refreshToken',
      visible: false,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.clientId',
      'http.encrypted.clientSecret',
      'http.auth.token.token',
      'http.auth.token.refreshToken',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
