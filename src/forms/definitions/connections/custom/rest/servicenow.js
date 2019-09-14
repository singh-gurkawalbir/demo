export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'servicenow',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/api/now/pa/scorecards',
    '/rest/baseURI': `https://${formValues['/instanceName']}.service-now.com`,
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
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.service-now.com')
          );

        return subdomain;
      },
    },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The username of your ServiceNow account.',
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The password of your ServiceNow account.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'instanceName',
      'rest.basicAuth.username',
      'rest.basicAuth.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
