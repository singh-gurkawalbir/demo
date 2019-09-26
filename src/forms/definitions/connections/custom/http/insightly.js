export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'insightly',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/v2.1/Contacts',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.insight.ly`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpText:
        'The API key of your Insightly account.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. This can be obtained from the Settings section and API Keys subsection.',
      inputType: 'password',
      defaultValue: '',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.basic.username'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
