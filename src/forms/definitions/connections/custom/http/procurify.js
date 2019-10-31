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
      helpText:
        'Enter your Procurify subdomain. For example, in https://celigo.procurify.com/api "celigo" is the subdomain.',
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
            baseUri.indexOf('.myshopify.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpText: 'Please enter the Username of your Procurify Account.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpText: 'Please enter password of your Procurify Account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.generateClientIdandSecret': {
      id: 'http.generateClientIdandSecret',
      type: 'tokengen',
      inputType: 'password',
      disabledWhen: [
        { field: 'http.auth.basic.username', is: [''] },
        { field: 'http.auth.basic.password', is: [''] },
      ],
      label: 'Generate Client Id &Secret',
      defaultValue: '',
      helpText:
        'Please click Generate "Client Id & Secret" button to get Client ID and Client Secret of your Procurify Account.',
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client Id',
      helpText: 'The client id of your Procurify account',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Client Secret',
      inputType: 'password',
      helpText: 'The client secret of your Procurify account',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      disabledWhen: [
        { field: 'http.unencrypted.clientId', is: [''] },
        { field: 'http.encrypted.clientSecret', is: [''] },
      ],
      label: 'Generate Token',
      defaultValue: '',
      helpText: 'The access token of your Procurify account.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.procurifySubdomain',
      'http.auth.basic.username',
      'http.auth.basic.password',
      'http.generateClientIdandSecret',
      'http.unencrypted.clientId',
      'http.encrypted.clientSecret',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
