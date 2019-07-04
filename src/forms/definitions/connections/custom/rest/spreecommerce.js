export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'spreecommerce',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/v1/zones',
    '/rest/baseURI': `${formValues['/rest/baseURI']}/api`,
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'X-Spree-Token',
    '/rest/authScheme': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      endAdornment: '/api',
      label: 'Base URI:',
      helpText:
        'Please enter your team name here which you configured while signing up for a new Zendesk account.',

      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain = baseUri.substring(0, baseUri.indexOf('/api'));

        return subdomain;
      },
    },
    {
      fieldId: 'rest.bearerToken',
      label: 'Token:',
      required: true,
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
