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
      helpText:
        'Please enter the Harvest account ID .Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Account ID safe. This can be obtained from the Settings section and Account ID subsection.',
      validWhen: {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.encrypted.accountId'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
