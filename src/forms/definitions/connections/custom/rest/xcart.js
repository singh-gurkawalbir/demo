export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({
      name: 'Authorization',
      value: 'ShippoToken {{{connection.rest.encrypted.token}}}',
    });
    headers.push({ name: 'Content-Type', value: 'application/json' });

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'shippo',
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://api.goshippo.com`,
      '/rest/pingRelativeURI': '/addresses',
      '/rest/pingMethod': 'GET',
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      label: 'Base URI:',
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
