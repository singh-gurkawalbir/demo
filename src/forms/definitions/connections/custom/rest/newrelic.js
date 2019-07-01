export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({
      name: 'X-API-KEY',
      value: '{{{connection.rest.encrypted.apiKey}}}',
    });
    headers.push({ name: 'Content-Type', value: 'application/json' });

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'newrelic',
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://api.newrelic.com`,
      '/rest/pingRelativeURI': `/v2/applications.json`,
      '/rest/headers': headers,
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.apiKey',
      type: 'text',
      label: 'API Key:',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
