export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'freshdesk',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/api/v2/admin/ticket_fields',
    '/http/ping/method': 'GET',
    '/http/ping/failPath': 'require_login',
    '/http/ping/failValues': [true],
    '/http/baseURI': `https://${
      formValues['/http/freshdeskSubdomain']
    }.freshdesk.com/`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    'http.freshdeskSubdomain': {
      type: 'text',
      id: 'http.freshdeskSubdomain',
      startAdornment: 'https://',
      endAdornment: '.freshdesk.com',
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
            baseUri.indexOf('.freshdesk.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API key',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'freshdesk.connection.http.auth.basic.username',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.freshdeskSubdomain',
          'http.auth.basic.username',
        ] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
