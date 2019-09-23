export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'oandaexchangerates',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/currencies.json',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://web-services.oanda.com/rates/api`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpText: 'Please enter the API Key of your OANDA account.',
      label: 'API Key:',
      required: true,
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
