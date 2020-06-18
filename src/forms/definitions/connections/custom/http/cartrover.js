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
      label: 'API user',
      helpKey: 'cartrover.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API key',
      helpKey: 'cartrover.connection.http.auth.basic.username',
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
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
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
