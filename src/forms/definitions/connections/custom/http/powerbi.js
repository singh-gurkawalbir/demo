export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'powerbi',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.powerbi.com',
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/failStatusCode': 403,
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.adminUser': {
      id: 'http.unencrypted.adminUser',
      label: 'Admin user',
      type: 'checkbox',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.unencrypted.adminUser'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
