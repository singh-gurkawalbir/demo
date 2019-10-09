export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
