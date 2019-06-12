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
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/v3/customers',
      '/type': 'rest',
      '/assistant': 'atera',
      '/rest/baseURI': 'https://app.atera.com/api',
      '/rest/headers': headers,
    };
  },

  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.apiKey',
      type: 'text',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained by Navigating to Admin >> API from the left hand panel.',
      inputType: 'password',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
