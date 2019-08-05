export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'google',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://www.googleapis.com/',
    '/rest/authURI': 'https://accounts.google.com/o/oauth2/auth',
    '/rest/oauthTokenURI': 'https://accounts.google.com/o/oauth2/token',
    '/rest/scopeDelimiter': ' ',
    '/rest/scope': ['https://www.googleapis.com/auth/content'],
  }),

  fields: [{ fieldId: 'name' }],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
