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
    application: { id: 'application', type: 'text', label: 'Application', defaultValue: r => r && r.assistant ? r.assistant : r.type, defaultDisabled: true, },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.basic.username', 'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
