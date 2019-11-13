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
      helpText:
        'The URL of your instance with ServiceNow. For example, https://mycompany.service-now.com.',
      startAdornment: 'https://',
      endAdornment: '.service-now.com',
      label: 'Enter subdomain into the base uri',
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
      helpText: 'The username of your ServiceNow account.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpText: 'The password of your ServiceNow account.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'instanceName',
      'http.auth.basic.username',
      'http.auth.basic.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
