export default {
  preSubmit: formValues => {
    const pingData = { sku_string: '1' };
    const headers = [];

    headers.push({ name: 'content-type', value: 'application/json' });
    headers.push({
      name: 'apikey',
      value: '{{{connection.rest.encrypted.apiKey}}}',
    });

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'retailops',
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://api.retailops.com`,
      '/rest/pingRelativeURI': '/product/sku/get~1.json',
      '/rest/pingMethod': 'POST',
      '/rest/pingBody': JSON.stringify(pingData),
      '/rest/headers': headers,
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.apiKey',
      label: 'API Key:',
      required: true,
      type: 'text',
      inputType: 'password',
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
