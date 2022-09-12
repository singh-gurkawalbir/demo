export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftonenote',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://graph.microsoft.com/v1.0',
    '/http/ping/relativeURI': '/me/onenote/notebooks',
    '/http/ping/method': 'GET',
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    '/http/auth/oauth/scope': [
      ...['openid', 'offline_access', 'Notes.Read'],
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
        fields: ['http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
