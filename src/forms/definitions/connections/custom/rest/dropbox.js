export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'dropbox',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.dropboxapi.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': `https://www.dropbox.com/1/oauth2/authorize`,
    '/rest/oauthTokenURI': `https://api.dropboxapi.com/1/oauth2/token`,
    '/rest/rest/scopeDelimiter': ' ',
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
