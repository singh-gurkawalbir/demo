export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'myobessentials',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.myob.com/au/essentials',
    '/http/auth/oauth/authURI':
      'https://secure.myob.com/oauth2/account/authorize',
    '/http/auth/oauth/tokenURI': 'https://secure.myob.com/oauth2/v1/authorize',
    '/http/auth/oauth/scope': ['la.global'],
    '/http/auth/oauth/scopeDelimiter': ',',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/headers': [{ name: 'x-myobapi-version', value: 'v0' }],
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
