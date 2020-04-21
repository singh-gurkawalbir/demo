export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'googlemail',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://www.googleapis.com/gmail/',
    '/http/auth/oauth/authURI': 'https://accounts.google.com/o/oauth2/auth',
    '/http/auth/oauth/tokenURI': 'https://accounts.google.com/o/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: ['email', 'profile', 'openid'],
    },
    genericOauth: {
      id: 'genericOauth',
      label: 'Configure your client id and secret',
      type: 'checkbox',
      required: true,
      defaultValue: r => !!(r && r.http && r.http._iClientId),
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      visibleWhen: [{ field: 'genericOauth', is: ['true'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhen: [{ field: 'genericOauth', is: ['true'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.oauth.scope',
      'genericOauth',
      'http._iClientId',
      'http.auth.oauth.callbackURL',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
