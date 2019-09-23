export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
