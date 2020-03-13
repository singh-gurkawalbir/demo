export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': '4castplus',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${formValues['/http/subdomain']}.4castplus.com`,
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/api/customers',
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': '_s',
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
        'The subdomain is the unique portion of the 4castplus.com address that you visit to log in to your portal.',
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
        'Password is your 4castplus account password. Multiple layers of protection are employed (including AES 256 encryption) to keep your password safe.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.subdomain',
      'http.unencrypted.username',
      'http.encrypted.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
