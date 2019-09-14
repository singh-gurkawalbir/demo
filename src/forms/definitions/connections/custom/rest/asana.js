export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'asana',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/1.0/users',
    '/rest/baseURI': 'https://app.asana.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'Authorization',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      required: true,
      label: 'Personal Access Token:',
      helpText:
        'Enter your personal access token. Note: There are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.bearerToken'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
