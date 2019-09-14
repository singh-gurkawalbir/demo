export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'slack',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': `https://slack.com/api`,
    '/rest/pingRelativeURI': 'api.test',
    '/rest/tokenLocation': 'url',
    '/rest/tokenParam': 'token',
    '/rest/pingSuccessPath': 'ok',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.bearerToken': { fieldId: 'rest.bearerToken', required: true },
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
