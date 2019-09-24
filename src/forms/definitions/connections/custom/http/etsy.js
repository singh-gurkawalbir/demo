export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
      label: 'API Key',
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
