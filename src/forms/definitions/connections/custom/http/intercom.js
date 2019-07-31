export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'intercom',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.intercom.io/`,
    '/http/auth/oauth/authURI': 'https://app.intercom.io/oauth',
    '/http/auth/oauth/tokenURI': 'https://api.intercom.io/auth/eagle/token',
    '/http/auth/oauth/accessTokenPath': 'access_token',
  }),
  fields: [
    { fieldId: 'name' },
    { fieldId: 'http.disableStrictSSL' },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'http.concurrencyLevel' },
  ],
};
