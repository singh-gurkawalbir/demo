export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'sharepoint',
    '/rest/baseURI': `https://${
      formValues['/rest/subDomain']
    } + '.sharepoint.com`,
    '/rest/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/rest/oauthTokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.subDomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.sharepoint.com',
      label: 'Subdomain:',
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
          baseUri.indexOf('.sharepoint.com')
        );

        return subdomain;
      },
    },
  ],
};
