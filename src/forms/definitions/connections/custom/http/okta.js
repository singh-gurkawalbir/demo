export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'okta',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/api/v1/users',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/http/oktaSubdomain']}.okta.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'SSWS',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.oktaSubdomain': {
      id: 'http.oktaSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.okta.com',
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
            baseUri.indexOf('.okta.com')
          );

        return subdomain;
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.oktaSubdomain', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
