export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'newrelic',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.newrelic.com`,
    '/http/ping/relativeURI': `/v2/applications.json`,
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'X-API-KEY',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.apiKey',
      type: 'text',
      label: 'API Key',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. From the account dropdown in the New Relic UI, select Account settings > Integrations > API keys to find it.',
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
