export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shipengine',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/carriers',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.shipengine.com',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'API-Key',
    '/http/auth/token/scheme': '',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      helpKey: 'shipengine.connection.http.auth.token.token',
      required: true,
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};

