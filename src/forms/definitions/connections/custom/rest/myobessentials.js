export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'myobessentials',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.myob.com/au/essentials`,
    '/rest/authURI': 'https://secure.myob.com/oauth2/account/authorize',
    '/rest/oauthTokenURI': 'https://secure.myob.com/oauth2/v1/authorize',
    '/rest/scope': ['la.global'],
    '/rest/scopeDelimiter': ',',
    '/rest/headers': [{ name: 'x-myobapi-version', value: 'v0' }],
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
