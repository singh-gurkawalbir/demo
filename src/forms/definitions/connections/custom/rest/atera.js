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
      name: '/rest/encrypted/apiKey',
      type: 'text',
      helpKey: 'atera.apiKey',
      inputType: 'password',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
