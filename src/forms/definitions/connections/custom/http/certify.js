export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'certify',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/expensereports',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.certify.com',
    '/http/headers': [
      { name: 'x-api-key', value: '{{{connection.http.encrypted.apiKey}}}' },
      { name: 'Content-Type', value: 'application/json' },
      {
        name: 'x-api-secret',
        value: '{{{connection.http.encrypted.apiSecret}}}',
      },
    ],
  }),

  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API Key of your Certify account.',
    },
    {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      label: 'API Secret:',
      inputType: 'password',
      helpText: 'The API Secret of your Certify account.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
