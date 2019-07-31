export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'etsy',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/listings/active',
    '/rest/baseURI': 'https://openapi.etsy.com',
    '/rest/tokenLocation': 'url',
    '/rest/tokenParam': 'api_key',
  }),

  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'rest.bearerToken',
      required: true,
      label: 'API Key:',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
