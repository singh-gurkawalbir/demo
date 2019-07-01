export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'signnow',
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
};
