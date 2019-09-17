export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zoom',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/users',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.zoom.us',
  }),

  fields: [
    { fieldId: 'name' },

    {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API Key of your zoom account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      label: 'API Secret:',
      inputType: 'password',
      helpText: 'The API Secret of your zoom account.',
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
