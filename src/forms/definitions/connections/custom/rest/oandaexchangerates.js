export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'oandaexchangerates',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/currencies.json',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://web-services.oanda.com/rates/api`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      helpText: 'Please enter the API Key of your OANDA account.',
      label: 'API Key:',
      required: true,
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
