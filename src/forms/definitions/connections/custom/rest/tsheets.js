export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'tsheets',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://${
      formValues['/rest/tsheetsSubdomain']
    }.tsheets.com/api`,
    '/rest/authURI': 'https://rest.tsheets.com/api/v1/authorize',
    '/rest/oauthTokenURI': 'https://rest.tsheets.com/api/v1/grant',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.tsheetsSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.tsheets.com/api',
      label: 'Subdomain:',
      helpText:
        'Please enter your subdomain here which can be obtained from the base url of your Tsheets account.',
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
          baseUri.indexOf('.tsheets.com/api')
        );

        return subdomain;
      },
    },
  ],
};
