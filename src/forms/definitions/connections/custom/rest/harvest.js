export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'harvest',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.harvestapp.com/v2/',
    '/rest/authURI': 'https://id.getharvest.com/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://id.getharvest.com/api/v1/oauth2/token',
    '/rest/scopeDelimiter': ' ',
    '/rest/headers': [
      {
        name: 'Harvest-Account-Id',
        value: '{{{connection.rest.encrypted.accountId}}}',
      },
      { name: 'User-Agent', value: 'Celigo Integrator' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
