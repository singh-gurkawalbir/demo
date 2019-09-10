export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'exacterp',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/listings/active',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://start.exactonline.com',
    '/http/auth/oauth/authURI': 'https://start.exactonline.com/api/oauth2/auth',
    '/http/auth/oauth/tokenURI':
      'https://start.exactonline.com/api/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/location': 'header',
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
