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
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client ID',
      helpText: 'Please enter Client ID of your Bronto Account.',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Client Secret',
      inputType: 'password',
      helpText:
        'Please enter Client Secret of your Bronto Account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
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
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The access token of your Bronto account.',
    },
    'http.auth.token.refreshToken': {
      id: 'http.auth.token.refreshToken',
      type: 'text',
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
