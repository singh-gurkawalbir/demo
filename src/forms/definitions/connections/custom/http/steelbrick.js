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
    application: { id: 'application', type: 'text', label: 'Application', defaultValue: r => r && r.assistant ? r.assistant : r.type, defaultDisabled: true, },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
