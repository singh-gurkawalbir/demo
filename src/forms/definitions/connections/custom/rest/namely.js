export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'namely',
    '/rest/authType': 'token',
    '/rest/authHeader': 'Authorization',
    '/rest/authScheme': 'Bearer',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://${
      formValues['/rest/namelyCompanyName']
    }'.namely.com`,
    '/rest/pingRelativeURI': '/api/v1/profiles/me.json',
    '/rest/pingMethod': 'GET',
    '/rest/headers': [
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
        const baseUri = r.rest.baseURI;
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
  ],
};
