export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'orderful',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.orderful.com',
    '/http/ping/relativeURI': '/v2/transactions',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'orderful-api-key',
    '/http/auth/token/scheme': '',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpKey: 'orderful.connection.http.auth.token.token',
      label: 'API Key',
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
