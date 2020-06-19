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
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'https://www.googleapis.com/auth/gmail.labels',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.insert',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.metadata',
        'https://www.googleapis.com/auth/gmail.settings.basic',
        'https://www.googleapis.com/auth/gmail.settings.sharing',
        'https://mail.google.com/'
      ],
    },
    genericOauthConnector: { formId: 'genericOauthConnector' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.oauth.scope', 'genericOauthConnector'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
