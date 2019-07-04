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
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.bearerToken',
      inputType: 'password',
      helpText:
        'Secret Key available from Jet under API Section-> Get API Keys',
      label: 'API Key:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
