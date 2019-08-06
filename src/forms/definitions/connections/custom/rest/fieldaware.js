export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'fieldaware',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/auth/whoami',
    '/rest/baseURI': 'https://api.fieldaware.net',
    '/rest/headers': [
      {
        name: 'Authorization',
        value: 'Token {{{connection.rest.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Accept', value: 'application/json' },
    ],
  }),

  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.encrypted.apiKey',
      type: 'text',
      inputType: 'password',
      required: true,
      label: 'API Key:',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained by reaching out to FieldAware support team.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
