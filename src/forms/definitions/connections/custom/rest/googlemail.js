export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'google',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://www.googleapis.com/gmail/',
    '/rest/authURI': 'https://accounts.google.com/o/oauth2/auth',
    '/rest/oauthTokenURI': 'https://accounts.google.com/o/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      scopes: [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.insert',
        'https://www.googleapis.com/auth/gmail.labels',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.settings.sharing',
        'https://www.googleapis.com/auth/gmail.settings.basic',
        'https://www.googleapis.com/auth/gmail.metadata',
      ],
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
