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
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
