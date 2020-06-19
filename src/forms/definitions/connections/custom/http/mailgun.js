export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'mailgun',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/domains',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.mailgun.net/v3',
    '/http/auth/basic/username': 'api',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API key',
      helpKey: 'mailgun.connection.http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
