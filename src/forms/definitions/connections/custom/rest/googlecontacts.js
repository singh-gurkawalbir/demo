export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'google',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://www.google.com/m8/feeds/',
    '/rest/authURI': 'https://accounts.google.com/o/oauth2/auth',
    '/rest/oauthTokenURI': 'https://accounts.google.com/o/oauth2/token',
    '/rest/scopeDelimiter': ' ',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      scopes: [
        'https://www.google.com/m8/feeds/',
        'https://www.googleapis.com/auth/contacts.readonly',
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
