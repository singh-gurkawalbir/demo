export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shipstation',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'carriers',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://ssapi.shipstation.com',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'shipstation.connection.http.auth.basic.username',
      label: 'API key',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API secret',
      helpKey: 'shipstation.connection.http.auth.basic.password',
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
