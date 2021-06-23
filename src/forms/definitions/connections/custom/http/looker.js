export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'looker',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/instanceurl']}/api/3.1`,
    '/http/ping/relativeURI': '/looks',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/token/refreshRelativeURI': `https://${formValues['/http/instanceurl']}/api/3.1/login`,
    '/http/auth/token/refreshBody': '{ "client_id": "{{{connection.http.unencrypted.clientId}}}", "client_secret": "{{{connection.http.encrypted.clientSecret}}}" }',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.instanceurl': {
      id: 'http.instanceurl',
      type: 'text',
      label: 'Instance URL',
      startAdornment: 'https://',
      endAdornment: '/api',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('/api/3.1')
          );

        return subdomain;
      },
      helpKey: 'looker.connection.http.instanceurl',
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      type: 'text',
      label: 'Client ID',
      required: true,
      helpKey: 'looker.connection.http.unencrypted.clientId',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Client secret',
      required: true,
      helpKey: 'looker.connection.http.encrypted.clientSecret',
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
          'http.instanceurl',
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
