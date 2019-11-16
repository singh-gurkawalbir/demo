export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'azureactivedirectory',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://graph.microsoft.com`,
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/oauth/scope': [
      ...['offline_access'],
      ...formValues['/http/auth/oauth/scope'],
    ],
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'User.Export.All',
        'User.Invite.All',
        'User.Read',
        'User.Read.All',
        'User.ReadBasic.All',
        'User.ReadWrite',
        'User.ReadWrite.All',
        'UserActivity.ReadWrite.CreatedByApp',
        'UserTimelineActivity.Write.CreatedByApp',
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
