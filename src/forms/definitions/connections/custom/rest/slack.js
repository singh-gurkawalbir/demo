export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'slack',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': `https://slack.com/api`,
    '/rest/pingRelativeURI': 'api.test',
    '/rest/tokenLocation': 'url',
    '/rest/tokenParam': 'token',
    '/rest/pingSuccessPath': 'ok',
  }),
  fields: [
    { fieldId: 'name' },
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
