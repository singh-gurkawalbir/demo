export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'doubleclick',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://www.googleapis.com',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': `https://accounts.google.com/o/oauth2/auth`,
    '/http/auth/oauth/tokenURI': `https://accounts.google.com/o/oauth2/token`,
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      scopes: [
        'https://www.googleapis.com/auth/dfatrafficking',
        'https://www.googleapis.com/auth/dfareporting',
        'https://www.googleapis.com/auth/ddmconversions',
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
