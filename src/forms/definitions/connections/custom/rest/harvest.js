export default {
  preSubmit: formValues => ({
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

  fields: [{ fieldId: 'name' }],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
