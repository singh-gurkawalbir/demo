export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'easypost',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/addresses',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://api.easypost.com/v2`,
    '/rest/basicAuth/password': '',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      label: 'API Key',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.basicAuth.username'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
