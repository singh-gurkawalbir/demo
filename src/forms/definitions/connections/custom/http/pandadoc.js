export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'pandadoc',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.pandadoc.com/public/v1',
    '/http/ping/relativeURI': '/documents',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'API-Key',
    '/http/auth/token/headerName': 'Authorization',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      id: 'http.auth.token.token',
      label: 'API key',
      required: true,
      helpKey: 'pandadoc.connection.http.auth.token.token',
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
      { collapsed: true,
        label: 'Application details',
        fields: [
          'http.auth.token.token',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['httpAdvanced'],
      },
    ],
  },
};
