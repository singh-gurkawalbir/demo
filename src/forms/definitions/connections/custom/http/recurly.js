export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'recurly',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'xml',
    '/http/ping/relativeURI': '/v2/accounts',
    '/http/auth/basic/password': '',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/recurlySubdomain']}.recurly.com`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    recurlySubdomain: {
      id: 'recurlySubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.recurly.com',
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
            baseUri.indexOf('.recurly.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API key',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      helpKey: 'recurly.connection.http.auth.basic.username',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['recurlySubdomain', 'http.auth.basic.username'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
