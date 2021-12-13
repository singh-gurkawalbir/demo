export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'yotpo',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.yotpo.com',
    '/http/ping/relativeURI': `/v1/apps/${formValues['/http/unencrypted/clientId']}/reviews`,
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': 'utoken',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshRelativeURI': 'https://api.yotpo.com/oauth/token',
    '/http/auth/token/refreshBody': '{ "client_id": "{{{connection.http.unencrypted.clientId}}}", "client_secret": "{{{connection.http.encrypted.clientSecret}}}", "grant_type": "client_credentials" }',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      type: 'text',
      label: 'API key',
      required: true,
      helpKey: 'yotpo.connection.http.unencrypted.clientId',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      label: 'API secret',
      required: true,
      helpKey: 'yotpo.connection.http.encrypted.clientSecret',
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
      inputboxLabel: 'Token',
      defaultValue: '',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'http.unencrypted.clientId',
          'http.encrypted.clientSecret',
          'http.auth.token.token',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['httpAdvanced'],
      },
    ],
  },
};
