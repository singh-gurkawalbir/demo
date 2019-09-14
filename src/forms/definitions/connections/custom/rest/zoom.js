export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zoom',
    '/rest/authType': 'jwt',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/users',
    '/rest/baseURI': 'https://api.zoom.us',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.encrypted.apiKey': {
      id: 'rest.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API Key of your zoom account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'rest.encrypted.apiSecret': {
      id: 'rest.encrypted.apiSecret',
      required: true,
      type: 'text',
      label: 'API Secret:',
      inputType: 'password',
      helpText: 'The API Secret of your zoom account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.encrypted.apiKey', 'rest.encrypted.apiSecret'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
