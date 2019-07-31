export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'doubleclick',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://www.googleapis.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': `https://accounts.google.com/o/oauth2/auth`,
    '/rest/oauthTokenURI': `https://accounts.google.com/o/oauth2/token`,
    '/rest/rest/scopeDelimiter': ' ',
    '/rest/rest/authHeader': 'Authorization',
    '/rest/rest/authScheme': 'Bearer',
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
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
