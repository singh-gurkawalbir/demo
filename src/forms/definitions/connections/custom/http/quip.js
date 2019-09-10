export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'quip',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': `https://platform.quip.com`,
    '/http/ping/relativeURI': '/1/threads/recent',
    '/http/ping/method': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.token.token',
      label: 'API Access Token',
      required: true,
      helpText: 'Please enter your API token here.',
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
