export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'sharepoint',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
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
        "Please enter your SharePoint subdomain. For example, in https://temp-portal.sharepoint.com 'temp-portal' is the subdomain.",
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
