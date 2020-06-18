export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'oandaexchangerates',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/currencies.json',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://web-services.oanda.com/rates/api',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpKey: 'oandaexchangerates.connection.http.auth.token.token',
      label: 'API key',
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
