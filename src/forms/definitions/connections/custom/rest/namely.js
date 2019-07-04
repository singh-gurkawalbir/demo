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
      helpText:
        'Please enter your team name here which you configured while signing up for a new Zendesk account.',
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
      id: 'rest.bearerToken',
      type: 'text',
      label: 'Personal Access Token:',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
