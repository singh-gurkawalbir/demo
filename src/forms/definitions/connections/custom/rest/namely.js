export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'namely',
    '/rest/authType': 'token',
    '/rest/authHeader': 'Authorization',
    '/rest/authScheme': 'Bearer',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.newrelic.com`,
    '/rest/pingRelativeURI': '/v2/applications.json',
    '/rest/pingMethod': 'GET',
    '/rest/headers': [
      { name: 'X-API-KEY', value: '{{{connection.rest.encrypted.apiKey}}}' },
      {
        name: 'Accept',
        value: 'application/json',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.namelyCompanyName',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.namely.com',
      label: 'Company Name:',
      helpText: 'Your subdomain. For example, https://mysubdomain.namely.com',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.namely.com')
        );

        return subdomain;
      },
    },
    {
      fieldId: 'rest.bearerToken',
      label: 'Personal Access Token:',
      required: true,
      helpText: 'The personal access token of your account on namely.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
