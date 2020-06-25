export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'harvest',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.harvestapp.com/v2/',
    '/http/auth/oauth/authURI': 'https://id.getharvest.com/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://id.getharvest.com/api/v1/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/headers': [
      {
        name: 'Harvest-Account-Id',
        value: '{{{connection.http.encrypted.accountId}}}',
      },
      { name: 'User-Agent', value: 'Celigo Integrator' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.accountId': {
      id: 'http.encrypted.accountId',
      type: 'text',
      label: 'Account ID',
      defaultValue: '',
      helpKey: 'harvest.connection.http.encrypted.accountId',
      validWhen: {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.encrypted.accountId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
