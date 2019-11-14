export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftonenote',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://graph.microsoft.com/v1.0`,
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    '/http/auth/oauth/scope': [
      ...['openid', 'offline_access'],
      ...formValues['/http/auth/oauth/scope'],
    ],
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'openid',
        'offline_access',
        'Notes.Create',
        'Notes.Read',
        'Notes.ReadWrite',
        'Notes.Read.All',
        'Notes.ReadWrite.All',
      ],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.oauth.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
