export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'gorgias',
    '/http/auth/type': 'basic',
    '/http/baseURI': `https://${formValues['/gorgiasSubdomain']}.gorgias.com`,
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/api/tickets',
    '/http/ping/method': 'GET',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    gorgiasSubdomain: {
      type: 'text',
      id: 'gorgiasSubdomain',
      startAdornment: 'https://',
      endAdornment: '.gorgias.com',
      label: 'Subdomain',
      required: true,
      helpKey: 'gorgias.connection.gorgiasSubdomain',
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
            baseUri.indexOf('.gorgias.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'gorgias.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'gorgias.connection.http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['gorgiasSubdomain',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
