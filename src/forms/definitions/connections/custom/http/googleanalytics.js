export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'googleanalytics',
    '/http/auth/type': 'oauth',
    '/http/auth/oauth/useIClientFields': false,
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://www.googleapis.com/analytics/',
    '/http/auth/oauth/authURI': 'https://accounts.google.com/o/oauth2/auth',
    '/http/auth/oauth/tokenURI': 'https://accounts.google.com/o/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'https://www.googleapis.com/auth/analytics',
        'https://www.googleapis.com/auth/analytics.edit',
        'https://www.googleapis.com/auth/analytics.manage.users',
        'https://www.googleapis.com/auth/analytics.manage.users.readonly',
        'https://www.googleapis.com/auth/analytics.provision',
        'https://www.googleapis.com/auth/analytics.readonly',
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
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
