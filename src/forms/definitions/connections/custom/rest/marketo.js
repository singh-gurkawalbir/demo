export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'marketo',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://${formValues['/rest/marketoSubdomain']}/rest`,
    '/rest/pingRelativeURI': '/v1/activities/types.json',
    '/rest/pingSuccessPath': 'success',
    '/rest/pingSuccessValues': ['true'],
    '/rest/refreshTokenURI': `https://${
      formValues['/rest/marketoSubdomain']
    }/identity/oauth/token?grant_type=client_credentials&client_id=${
      formValues['/rest/unencrypted/clientId']
    }&client_secret=${formValues['/rest/encrypted/clientSecret']}`,
    '/rest/refreshTokenMethod': 'GET',
    '/rest/refreshTokenMediaType': 'json',
    '/rest/refreshTokenPath': 'access_token',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.marketoSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '/rest',
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
          baseUri.indexOf('/rest')
        );

        return subdomain;
      },
    },
    {
      id: 'rest.unencrypted.clientId',
      type: 'text',
      label: 'Client Id:',
      required: true,
    },
    {
      id: 'rest.encrypted.clientSecret',
      type: 'text',
      label: 'Client Secret:',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
