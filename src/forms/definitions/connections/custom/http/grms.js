export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'grms',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://sandbox-api.globalrms.com/api/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': ' ',
    '/http/auth/token/headerName': 'AccessToken',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/ratings',
    '/http/auth/token/refreshRelativeURI':
      'https://sandbox-api.globalrms.com/api/accessToken',
    '/http/auth/token/refreshBody':
      '{"ApiKey":"{{{connection.http.unencrypted.apiKey}}}","ApiSecret":"{{{connection.http.encrypted.apiSecret}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshTokenPath': 'token.TransactionID',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/failPath': 'ResponseCode',
    '/http/auth/failValues': [210],
    '/http/auth/token/refreshHeaders': [
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.apiKey': {
      id: 'http.unencrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key',
      helpKey: 'grms.connection.http.unencrypted.apiKey',
    },
    'http.encrypted.apiSecret': {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'API Secret',
      inputType: 'password',
      helpKey: 'grms.connection.http.encrypted.apiSecret',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.apiKey', is: [''] },
        { field: 'http.encrypted.apiSecret', is: [''] },
      ],
      label: 'Generate Token',
      defaultValue: '',
      required: true,
      helpKey: 'grms.connection.http.auth.token.token',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.apiKey',
      'http.encrypted.apiSecret',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
