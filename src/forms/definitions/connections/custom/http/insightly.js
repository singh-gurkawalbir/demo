export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'insightly',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/v2.1/Contacts',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.insight.ly`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.basic.username',
      helpText: 'The API key of your Insightly account.',
      inputType: 'password',
      defaultValue: '',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
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
