export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'returnly',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.returnly.com/`,
    '/http/ping/relativeURI': '/returns.json',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'X-Api-Token',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.apiKey',
      label: 'API Key',
      defaultValue: '',
      required: true,
      type: 'text',
      inputType: 'password',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Summary tab in Your Account section.',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
