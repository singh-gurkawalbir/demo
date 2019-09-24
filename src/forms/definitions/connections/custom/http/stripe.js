export default {
  preSave: formValues => ({
    ...formValues,
    '/assistant': 'stripe',
    '/http/auth/type': 'token',
    '/type': 'http',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/v1/charges',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.stripe.com/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Secret Key',
      required: true,
      helpText: 'The secret key of your Stripe account.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
