export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'pulseway',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/systems',
    '/http/ping/method': 'GET',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.baseURI',
      helpText:
        'Please enter baseURI of your Pulseway account. If you host your own Pulseway Enterprise Server, use “https://your-server-name/api” as base URL.',
    },
    {
      fieldId: 'http.auth.basic.username',
    },
    {
      fieldId: 'http.auth.basic.password',
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
