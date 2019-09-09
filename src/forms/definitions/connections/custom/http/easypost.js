export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'easypost',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/addresses',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.easypost.com/v2',
    '/http/auth/basic/password': '',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      inputType: 'password',
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
