export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'jazzhr',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.resumatorapi.com/v1',
    '/http/ping/relativeURI': '/applicants',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': 'apikey',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      required: true,
      helpKey: 'jazzhr.connection.http.auth.token.token',
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

