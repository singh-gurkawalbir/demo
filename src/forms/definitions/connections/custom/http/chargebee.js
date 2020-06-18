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
      endAdornment: '.chargebee.com/api',
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
            baseUri.indexOf('.chargebee.com/api')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API key',
      helpKey: 'chargebee.connection.http.auth.basic.username',
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['chargebeeSubdomain', 'http.auth.basic.username'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
