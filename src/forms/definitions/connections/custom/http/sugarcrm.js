export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'sugarcrm',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/sugarcrmSubdomain']}/rest/${
      formValues['/http/unencrypted/version']
    }`,
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/Activities',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': ' ',
    '/http/auth/token/headerName': 'OAuth-Token',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshRelativeURI': `${
      formValues['/http/baseURI']
    }/oauth2/token`,
    '/http/auth/token/refreshBody':
      '{"grant_type":"password","client_id":"{{{connection.http.unencrypted.clientID}}}","client_secret":"","username":"{{{connection.http.unencrypted.username}}}","password":"{{{connection.http.encrypted.password}}}","platform":"base"}',
    '/http/auth/token/refreshMethod': 'POST',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    sugarcrmSubdomain: {
      id: 'sugarcrmSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/rest',
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
            baseUri.indexOf('/rest')
          );

        return subdomain;
      },
    },
    'http.unencrypted.version': {
      id: 'http.unencrypted.version',
      required: true,
      type: 'text',
      label: 'Version',
    },
    'http.unencrypted.clientID': {
      id: 'http.unencrypted.clientID',
      required: true,
      type: 'text',
      label: 'Client id',
    },
    'http.unencrypted.platform': {
      id: 'http.unencrypted.platform',
      required: true,
      type: 'text',
      label: 'Platform',
    },
    'http.unencrypted.username': {
      fieldId: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
    },
    'http.encrypted.password': {
      fieldId: 'http.encrypted.password',
      type: 'text',
      label: 'Password',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Client secret',
      placeholder: 'Optional if Client Secret is empty',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.username', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
      label: 'Generate token',
      defaultValue: '',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'sugarcrmSubdomain',
      'http.unencrypted.version',
      'http.unencrypted.clientID',
      'http.unencrypted.platform',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.encrypted.clientSecret',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
