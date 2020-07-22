export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'messagemedia',
    '/http/auth/type': 'basic',
    '/http/baseURI': 'https://api.messagemedia.com',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/replies',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      fieldId: 'application',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API key',
      helpKey: 'messagemedia.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API secret',
      helpKey: 'messagemedia.connection.http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.basic.username', 'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
