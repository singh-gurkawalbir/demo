export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'cartrover',
    '/http/auth/type': 'basic',
    '/http/baseURI': 'https://api.cartrover.com/',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/merchant/inventory',
    '/http/ping/method': 'GET',
    '/http/ping/successPath': 'success_code',
    '/http/ping/successValues': ['true'],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API User',
      helpKey: 'cartrover.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API Key',
      helpKey: 'cartrover.connection.http.auth.basic.username',
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
