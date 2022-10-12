export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'bundleb2b',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'v3/io/companies',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.bundleb2b.net/api/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'authToken',
    '/http/auth/token/scheme': '',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshRelativeURI': 'https://api.bundleb2b.net/api/io/auth/backend',
    '/http/auth/token/refreshBody': '{ "storeHash": "{{{connection.http.unencrypted.storeHash}}}", "email": "{{{connection.http.unencrypted.email}}}", "password": "{{{connection.http.encrypted.password}}}", "channelId": 1, "name": "token", "beginAt": "1657885403", "endAt": "2147483647" }',
    '/http/auth/token/refreshTokenPath': 'data.token',
    '/http/auth/failStatusCode': '403',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.email': {
      id: 'http.unencrypted.email',
      type: 'text',
      label: 'Email',
      required: true,
      helpKey: 'bundleb2b.connection.http.unencrypted.email',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      description:
          'Note: for security reasons this field must always be re-entered.',
      label: 'Password',
      required: true,
      helpKey: 'bundleb2b.connection.http.encrypted.password',
    },
    'http.unencrypted.storeHash': {
      id: 'http.unencrypted.storeHash',
      type: 'text',
      label: 'Store hash',
      required: true,
      helpKey: 'bundleb2b.connection.http.unencrypted.storeHash',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.storeHash', is: [''] },
        { field: 'http.unencrypted.email', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
      label: 'Generate token',
      inputboxLabel: 'Token',
      defaultValue: '',
      required: true,
      helpKey: 'bundleb2b.connection.http.auth.token.token',

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
        fields: ['http.unencrypted.email',
          'http.encrypted.password',
          'http.unencrypted.storeHash',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

