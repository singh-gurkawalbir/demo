export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'splunk',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/',
    '/rest/pingMethod': 'GET',
    '/rest/disableStrictSSL': true,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.baseURI': { fieldId: 'rest.baseURI' },
    'rest.basicAuth.username': { fieldId: 'rest.basicAuth.username' },
    'rest.basicAuth.password': { fieldId: 'rest.basicAuth.password' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.baseURI',
      'rest.basicAuth.username',
      'rest.basicAuth.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
