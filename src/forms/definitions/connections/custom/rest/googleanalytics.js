export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'google',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://www.googleapis.com/analytics/',
    '/rest/authURI': 'https://accounts.google.com/o/oauth2/auth',
    '/rest/oauthTokenURI': 'https://accounts.google.com/o/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      scopes: [
        'https://www.googleapis.com/auth/analytics',
        'https://www.googleapis.com/auth/analytics.edit',
        'https://www.googleapis.com/auth/analytics.manage.users',
        'https://www.googleapis.com/auth/analytics.manage.users.readonly',
        'https://www.googleapis.com/auth/analytics.provision',
        'https://www.googleapis.com/auth/analytics.readonly',
      ],
    },
  ],
};
