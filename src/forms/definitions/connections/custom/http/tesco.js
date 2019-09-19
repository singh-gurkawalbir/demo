export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'tesco',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/grocery/products/?query=name&offset=0&limit=10',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://dev.tescolabs.com`,
    '/http/headers': [
      {
        name: 'Ocp-Apim-Subscription-Key',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.apiKey',
      label: 'Ocp Apim Subscription Key:',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpText: 'The subscription key of your Tesco account.',
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
