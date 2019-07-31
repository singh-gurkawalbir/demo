export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'easyship',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'reference/v1/categories',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.easyship.com/`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.token.token',
      label: 'API Access Token:',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. You can generate the API Access Token from https://app.easyship.com/connect. You will need to create an API connection, and then retrieve the token from the store settings.',
      required: true,
    },
    { fieldId: 'http.disableStrictSSL' },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'http.concurrencyLevel' },
  ],
};
