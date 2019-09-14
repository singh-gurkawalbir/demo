export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'anaplan',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '1/3/workspaces',
    '/rest/baseURI': 'https://api.anaplan.com/',
  }),

  fieldMap: {
    name: { fieldId: 'name' },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The username of your Anaplan account.',
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The password of your Anaplan account.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.basicAuth.username', 'rest.basicAuth.password'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
