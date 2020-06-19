export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'googlesheets',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://sheets.googleapis.com/',
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
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
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
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
