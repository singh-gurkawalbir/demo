export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'onelogin',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.${
      formValues['/http/oneloginRegion']
    }.onelogin.com/api`,
    '/http/token/location': 'header',
    '/http/token/headerName': 'Authorization',
    '/http/token/scheme': 'Bearer',
    '/http/token/refreshMethod': 'POST',
    '/http/token/refreshBody':
      '{"grant_type":"refresh_token", "access_token":"{{{connection.http.auth.token.token}}}", "refresh_token":"{{{connection.http.auth.token.refreshToken}}}"}',
    '/http/token/refreshHeaders': [
      { name: 'Content-Type', value: 'application/json' },
    ],
    '/http/ping/relativeURI': '/1/users',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.oneloginRegion': {
      id: 'http.oneloginRegion',
      type: 'text',
      startAdornment: 'https://api.',
      endAdornment: '.onelogin.com/api',
      label: 'Region',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(12, baseUri.indexOf('.onelogin.com/api'));

        return subdomain;
      },
    },
    'http.unencrypted.apiKey': {
      id: 'http.unencrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API key',
      helpKey: 'onelogin.connection.http.unencrypted.apiKey',
    },
    'http.encrypted.apiSecret': {
      id: 'http.encrypted.apiSecret',
      required: true,
      defaultValue: '',
      type: 'text',
      label: 'API secret',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'onelogin.connection.http.encrypted.apiSecret',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      defaultValue: '',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.encrypted.apiKey', is: [''] },
        { field: 'http.encrypted.apiSecret', is: [''] },
        { field: 'http.oneloginRegion', is: [''] },
      ],
      label: 'Generate token',
      inputboxLabel: 'Token',
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'onelogin.connection.http.auth.token.token',
    },
    'http.auth.token.refreshToken': {
      id: 'http.auth.token.refreshToken',
      type: 'text',
      label: 'refresh token',
      visible: false,
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
        fields: ['http.oneloginRegion',
          'http.unencrypted.apiKey',
          'http.encrypted.apiSecret',
          'http.auth.token.token',
          'http.auth.token.refreshToken'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
