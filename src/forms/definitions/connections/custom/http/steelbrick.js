export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'steelbrick',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://login.salesforce.com',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI':
      'https://login.salesforce.com/services/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.salesforce.com/services/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
