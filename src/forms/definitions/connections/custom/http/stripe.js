export default {
  preSubmit: formValues => ({
    ...formValues,
    '/assistant': 'stripe',
    '/http/auth/type': 'token',
    '/type': 'http',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/v1/charges',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.stripe.com/`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.token.token',
      label: 'Secret Key',
      required: true,
      helpText: 'The secret key of your Stripe account.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
