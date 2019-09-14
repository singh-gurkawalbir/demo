export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'klaviyo',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': `https://a.klaviyo.com/api/`,
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI':
      '/v1/lists?api_key={{{connection.http.encrypted.apiKey}}}',
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.apiKey',
      type: 'text',
      label: 'API Key',
      defaultValue: '',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Settings section and API Keys subsection.',
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
