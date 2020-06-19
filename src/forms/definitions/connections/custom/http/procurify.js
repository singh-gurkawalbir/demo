export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'procurify',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/procurifySubdomain']
    }.procurify.com`,
    '/http/auth/token/location': 'header',
    '/http/ping/relativeURI': '/api/user',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.procurifySubdomain': {
      id: 'http.procurifySubdomain',
      startAdornment: 'https://',
      endAdornment: '.procurify.com',
      type: 'text',
      label: 'Subdomain',
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
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.procurify.com')
          );

        return subdomain;
      },
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      required: true,
      type: 'text',
      label: 'Username',
      helpKey: 'procurify.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Password',
      inputType: 'password',
      helpKey: 'procurify.connection.http.encrypted.password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.generateClientIdandSecret': {
      id: 'http.generateClientIdandSecret',
      type: 'tokengen',
      inputType: 'password',
      helpKey: 'procurify.connection.http.generateClientIdandSecret',
      label: 'Generate client id & secret',
      defaultValue: '',
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      helpKey: 'procurify.connection.http.encrypted.clientId',
      label: 'Client id',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      required: true,
      type: 'tokengen',
      defaultValue: '',
      inputType: 'password',
      helpKey: 'procurify.connection.http.encrypted.clientSecret',
      label: 'Generate client id & secret',
      disabledWhen: [
        { field: 'http.unencrypted.username', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      helpKey: 'procurify.connection.http.auth.token.token',
      disabledWhen: [
        { field: 'http.unencrypted.clientId', is: [''] },
        { field: 'http.encrypted.clientSecret', is: [''] },
      ],
      label: 'Generate token',
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
        fields: ['http.procurifySubdomain',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http.encrypted.clientSecret',
          'http.unencrypted.clientId',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
