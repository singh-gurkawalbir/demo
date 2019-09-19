export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'aptrinsic',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/users',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.aptrinsic.com/',
    '/http/headers': [
      {
        name: 'X-APTRINSIC-API-KEY',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
    ],
  }),

  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key',
      inputType: 'password',
      defaultValue: '',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from Account Settings in REST API section.',
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
