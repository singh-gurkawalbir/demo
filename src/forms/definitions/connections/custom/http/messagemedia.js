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
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      helpKey: 'messagemedia.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API Secret',
      helpKey: 'messagemedia.connection.http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.basic.username', 'http.auth.basic.password'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
