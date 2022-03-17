export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'happyreturns',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://partner.happyreturns.com',
    '/http/ping/relativeURI': '/webhooks',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-HR-APIKEY',
    '/http/auth/token/scheme': '',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpKey: 'happyreturns.connection.http.auth.token.token',
      label: 'API key',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      {
        collapsed: true,
        label: 'Application details',
        fields: ['http.auth.token.token'],
      },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
