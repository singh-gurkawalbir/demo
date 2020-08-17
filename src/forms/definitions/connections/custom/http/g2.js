export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'g2',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': 'https://data.g2.com',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/api/v1/products',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Token',
    '/http/auth/token/headerName': 'Authorization',
    '/http/headers': [
      {
        name: 'Content-Type',
        value: 'application/vnd.api+json',
      },
      {
        name: 'Accept',
        value: 'application/vnd.api+json',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API token',
      required: true,
      helpKey: 'g2.connection.http.auth.token.token',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
