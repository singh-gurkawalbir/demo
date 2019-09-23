export default {
  preSubmit: formValues => ({
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
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      helpText:
        'Please enter your Okta subdomain here which you configured while signing up for a new Okta account.',
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
      helpText:
        'Please enter your Token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. To generate an API key for a given user, users should log in and click their name in the upper right hand corner of any page to get to the user context menu. There will be an "API Keys" option in that menu to go to the page.',
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
