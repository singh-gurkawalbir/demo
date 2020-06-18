export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'taxjar',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v2/categories',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.taxjar.com',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      required: true,
      helpKey: 'taxjar.connection.http.auth.token.token',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
