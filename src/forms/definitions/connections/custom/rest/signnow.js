export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'signnow',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api-eval.signnow.com`,
    '/rest/authURI': 'https://eval.signnow.com/proxy/index.php/authorize',
    '/rest/oauthTokenURI': 'https://api-eval.signnow.com/oauth2/token',
    '/rest/refreshTokenHeaders': [
      {
        name: 'Authorization',
        value: 'Basic {{connection.rest.encrypted.encodedClientCredentials}}',
      },
    ],
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
