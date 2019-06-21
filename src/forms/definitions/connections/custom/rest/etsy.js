export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/listings/active',
    '/type': 'rest',
    '/assistant': 'etsy',
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
  ],
};
