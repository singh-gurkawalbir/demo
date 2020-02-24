export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': '4castplus',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/subdomain']}.4castplus.com`,
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI':
      '/api/customers?_s={{{connection.http.auth.token.token}}}',
    '/http/auth/token/refreshRelativeURI': `https://${
      formValues['/http/subdomain']
    }.4castplus.com/api/login`,
    '/http/auth/token/refreshBody':
      '{ "UserName":"{{{connection.http.unencrypted.username}}}","Password":"{{{connection.http.encrypted.password}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshTokenPath': 'SessionId',
    '/http/auth/token/refreshMediaType': 'json',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.subdomain': {
      id: 'http.subdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.4castplus.com',
      label: 'Subdomain',
      required: true,
      helpText:
        'The user can find their Subdomain by logging in to their portal. It will be in the URL bar.',
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
            baseUri.indexOf('.4castplus.com')
          );

        return subdomain;
      },
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      required: true,
      type: 'text',
      label: 'Username',
      helpText: 'Username is your 4castplus account email.',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Password',
      helpText:
        'Password is your 4castplus account password.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your private key safe.',
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
      label: 'Generate Token',
      required: true,
      defaultValue: '',
      helpText: 'The Access Token of your Strata account',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.subdomain',
      'http.unencrypted.username',
      'http.encrypted.password',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
