export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'coupa',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/accounts',
    '/http/baseURI': `https://${formValues['/http/coupaSubdomain']}.com/api`,
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-COUPA-API-KEY',
    '/http/auth/token/scheme': ' ',
    '/http/headers': [
      {
        name: 'ACCEPT',
        value: 'application/json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.coupaSubdomain': {
      type: 'text',
      id: 'http.coupaSubdomain',
      startAdornment: 'https://',
      helpText:
        'Please enter the subdomain of your account here which can be obtained from the login url.',
      endAdornment: '.com',
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
            baseUri.indexOf('.com')
          );

        return subdomain;
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API Key',
      required: true,
      helpText: 'Please enter API Key of your Coupa account',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.coupaSubdomain', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
