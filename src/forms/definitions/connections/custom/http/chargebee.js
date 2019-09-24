export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'chargebee',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/basicAuth/password': '',
    '/http/ping/relativeURI': '/v2/subscriptions',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${
      formValues['/chargebeeSubdomain']
    }.chargebee.com/api`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    chargebeeSubdomain: {
      type: 'text',
      id: 'chargebeeSubdomain',
      startAdornment: 'https://',
      helpText:
        "Enter your Chargebee subdomain. For example, in https://mycompany.chargebee.com/api 'mycompany' is the subdomain.",
      endAdornment: '.chargebee.com/api',
      label: 'Subdomain',
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
            baseUri.indexOf('.chargebee.com/api')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API Key:',
      helpText: 'The API Key of your Chargebee account.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'chargebeeSubdomain', 'http.auth.basic.username'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
