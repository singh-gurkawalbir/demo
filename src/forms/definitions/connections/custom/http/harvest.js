export default {
  preSubmit: formValues => ({
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
    '/http/headers': [
      {
        name: 'Harvest-Account-Id',
        value: '{{{connection.http.encrypted.accountId}}}',
      },
      { name: 'User-Agent', value: 'Celigo Integrator' },
    ],
  }),

  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.accountId',
      type: 'text',
      label: 'Account ID',
      defaultValue: '',
      helpText: 'Please enter the Harvest account ID .',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\d]+$',
          message: 'Only numbers allowed',
        },
      },
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
