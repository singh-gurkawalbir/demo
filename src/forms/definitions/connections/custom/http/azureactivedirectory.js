export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'azureactivedirectory',
    '/http/auth/type': 'oauth',
    '/http/auth/oauth/useIClientFields': false,
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://graph.microsoft.com',
    '/http/ping/relativeURI': '/v1.0/users',
    '/http/ping/method': 'GET',
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/oauth/scope': [
      ...formValues['/http/auth/oauth/scope'],
    ],
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'Directory.AccessAsUser.All',
        'offline_access',
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
      defaultValue: r => (r?.http?.auth?.oauth.scope) || ['offline_access'],
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
