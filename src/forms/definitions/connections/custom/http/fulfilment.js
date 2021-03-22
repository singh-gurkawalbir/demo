export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'fulfilment.com',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.fulfillment.com',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
    '/http/ping/relativeURI': '/v2/inventory',
    '/http/ping/method': 'GET',
    '/http/auth/token/refreshRelativeURI': 'https://api.fulfillment.com/v2/oauth/access_token',
    '/http/auth/token/refreshBody': '{"grant_type":"refresh_token","client_id":"{{{connection.http.unencrypted.clientId}}}","client_secret":"{{{connection.http.encrypted.clientSecret}}}","refresh_token":"{{{connection.http.refreshToken}}}","password": "{{{connection.http.unencrypted.password}}}","scope": "oms","username": "{{{connection.http.unencrypted.username}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'json',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      type: 'text',
      label: 'Client ID',
      required: true,
      helpKey: 'fulfilment.connection.http.unencrypted.clientId',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      label: 'Client secret',
      inputType: 'password',
      defaultValue: '',
      required: true,
      helpKey: 'fulfilment.connection.http.encrypted.clientSecret',
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'fulfilment.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Password',
      required: true,
      helpKey: 'fulfilment.connection.http.encrypted.password',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      helpKey: 'fulfilment.connection.http.auth.token.token',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.username', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
        { field: 'http.unencrypted.clientId', is: [''] },
        { field: 'http.encrypted.clientSecret', is: [''] },
      ],
      label: 'Generate token',
      inputboxLabel: 'Token',
      defaultValue: '',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'http.unencrypted.clientId',
        ]},
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
