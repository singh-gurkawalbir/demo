export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'dropbox',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.dropboxapi.com',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': `https://www.dropbox.com/1/oauth2/authorize`,
    '/http/auth/oauth/tokenURI': `https://api.dropboxapi.com/1/oauth2/token`,
    '/http/auth/oauth/scopeDelimiter': ' ',
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
