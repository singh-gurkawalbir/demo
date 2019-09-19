export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'box',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.box.com',
    '/http/auth/token/location': 'header',
    '/http/auth/headerName': 'Authorization',
    '/http/auth/oauth/authURI': 'https://account.box.com/api/oauth2/authorize',
    '/http/auth/oauth/tokenURI': 'https://api.box.com/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),

  fields: [{ fieldId: 'name' }],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
