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
  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      fieldId: 'instanceName',
      helpText:
        'The URL of your instance with ServiceNow. For example, https://mycompany.service-now.com.',
      startAdornment: 'https://',
      endAdornment: '.service-now.com',
      label: 'Enter subdomain into the base uri',
      validWhen: {
        matchesRegEx: {
          pattern: '^[a-zA-Z0-9]*$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.service-now.com')
        );

        return subdomain;
      },
    },
    {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The username of your ServiceNow account.',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The password of your ServiceNow account.',
    },
  ],
};
