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
      helpText: 'Please enter the Username of your Procurify Account.',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Password',
      inputType: 'password',
      helpText:
        'Please enter password of your Procurify Account.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.generateClientIdandSecret': {
      id: 'http.generateClientIdandSecret',
      type: 'tokengen',
      inputType: 'password',

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
      type: 'tokengen',
      defaultValue: '',
      inputType: 'password',
      label: 'Generate Client Id &Secret',
      disabledWhen: [
        { field: 'http.unencrypted.username', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
      helpText:
        'Please click Generate "Client Id & Secret" button to get Client ID and Client Secret of your Procurify Account.',
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
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.encrypted.clientSecret',
      'http.unencrypted.clientId',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
