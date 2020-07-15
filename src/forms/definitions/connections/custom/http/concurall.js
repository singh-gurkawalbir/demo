export default {
  preSave: (formValues) => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'concurall',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/subdomain']}.api.concursolutions.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
    '/http/unencrypted/grantType': 'password',
    '/https/ping/method': 'GET',
    '/http/ping/relativeURI': '/api/v3.0/common/listitems',
    '/http/auth/token/refreshTokenURI': `https://${formValues['/http/subdomain']}.api.concursolutions.com/oauth2/v0/token`,
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/https/auth/token/body': '{\'grant_type\':\'refresh_token\',\'client_id\':\'{{{connection.http.unencrypted.clientId}}}\',\'credtype\':\'{{{connection.http.unencrypted.clientId}}}\',\'client_secret\':\'{{{connection.http.encrypted.clientSecret}}}\',\'refresh_token\':\'{{{connection.http.refreshToken}}}\'}',
    '/http/auth/token/refreshHeaders': [{ name: 'content-type', value: 'application/x-www-form-urlencoded' }],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.subdomain': {
      id: 'http.subdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.api.concursolutions.com',
      label: 'Subdomain',
      required: true,
      helpKey: 'concurall.connection.http.subdomain',
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
            baseUri.substring(
              baseUri.indexOf('https://') + 8,
              baseUri.indexOf('.api.concursolutions.com')
            );
        return subdomain;
      },
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      type: 'text',
      label: 'Client id',
      required: true,
      helpKey: 'concurall.connection.http.unencrypted.clientId',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      label: 'Client secret',
      required: true,
      helpKey: 'concurall.connection.http.encrypted.clientSecret',
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      helpKey: 'concurall.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Password',
      required: true,
      helpKey: 'concurall.connection.http.encrypted.password',
    },
    'http.unencrypted.credtype': {
      id: 'http.unencrypted.credtype',
      type: 'text',
      label: 'Credential type',
      required: true,
      defaultValue: r => (r && r.http && r.http.credtype) || 'password',
      helpKey: 'concurall.connection.http.unencrypted.credtype',
      options: [
        {
          items: [
            { label: 'Password', value: 'password' },
            { label: 'Auth token', value: 'authtoken' },
          ],
        },
      ],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      label: 'Generate token',
      defaultValue: '',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.subdomain',
      'http.unencrypted.clientId',
      'http.encrypted.clientSecret',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.unencrypted.credtype',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
