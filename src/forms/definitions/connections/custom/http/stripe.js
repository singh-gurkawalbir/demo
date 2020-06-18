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
      label: 'Secret key',
      helpKey: 'stripe.connection.http.auth.token.token',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
