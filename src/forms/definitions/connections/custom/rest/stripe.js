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
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      label: 'Secret Key:',
      required: true,
      helpText: 'The secret key of your Stripe account.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.bearerToken'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
