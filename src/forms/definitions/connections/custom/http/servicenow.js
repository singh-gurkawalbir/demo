export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'servicenow',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/api/now/pa/scorecards',
    '/http/baseURI': `https://${formValues['/instanceName']}.service-now.com`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    instanceName: {
      type: 'text',
      id: 'instanceName',
      startAdornment: 'https://',
      endAdornment: '.service-now.com',
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
            baseUri.indexOf('.service-now.com')
          );

        return subdomain;
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'servicenow.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'servicenow.connection.http.auth.basic.password',
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
        fields: ['instanceName',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
