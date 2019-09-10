export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'servicenow',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/api/now/pa/scorecards',
    '/http/baseURI': `https://${formValues['/instanceName']}.service-now.com`,
  }),
  fields: [
    { fieldId: 'name' },
    {
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
    {
      fieldId: 'http.auth.basic.username',
      helpText: 'The username of your ServiceNow account.',
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText: 'The password of your ServiceNow account.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
