export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'tsheets',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/tsheetsSubdomain']
    }.tsheets.com/api`,
    '/http/auth/oauth/authURI': 'https://rest.tsheets.com/api/v1/authorize',
    '/http/auth/oauth/tokenURI': 'https://rest.tsheets.com/api/v1/grant',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.tsheetsSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.tsheets.com/api',
      label: 'Subdomain',
      helpText:
        'Please enter your subdomain here which can be obtained from the base url of your Tsheets account.',
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
            baseUri.indexOf('.tsheets.com/api')
          );

        return subdomain;
      },
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
