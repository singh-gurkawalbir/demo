export default {
  preSubmit: formValues => ({
    ...formValues,
    '/assistant': 'stripe',
    '/rest/authType': 'token',
    '/type': 'rest',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/v1/charges',
    '/rest/baseURI': `https://api.stripe.com/`,
    '/rest/tokenLocation': 'header',
    '/rest/authHeader': 'Authorization',
    '/rest/authScheme': 'Bearer',
  }),
  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.bearerToken',
      label: 'Secret key:',
      required: true,
      helpText: 'The secret key of your Stripe account.',
    },
  ],
};
