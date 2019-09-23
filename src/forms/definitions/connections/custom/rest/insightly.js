export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'insightly',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/v2.1/Contacts',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://api.insight.ly`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The API key of your Insightly account.',
      inputType: 'password',
      label: 'API Key:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
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
