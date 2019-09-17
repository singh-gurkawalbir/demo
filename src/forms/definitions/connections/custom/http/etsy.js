export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'etsy',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/listings/active',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://openapi.etsy.com',
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': 'api_key',
  }),

  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'http.auth.token.token',
      required: true,
      label: 'API Key:',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
