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
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Password',
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
