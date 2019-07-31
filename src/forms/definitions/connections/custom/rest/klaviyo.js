export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'klaviyo',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': `https://a.klaviyo.com/api/`,
    '/rest/pingRelativeURI':
      '/v1/lists?api_key={{{connection.rest.encrypted.apiKey}}}',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.apiKey',
      type: 'text',
      label: 'API Key:',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Settings section and API Keys subsection.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
