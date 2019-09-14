export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'quip',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': `https://platform.quip.com`,
    '/rest/pingRelativeURI': '/1/threads/recent',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      label: 'API Access Token:',
      required: true,
      helpText: 'Please enter your API token here.',
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
