export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'autopilot',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'v1/contacts',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api2.autopilothq.com/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'autopilotapikey',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      helpKey: 'autopilot.connection.http.auth.token.token',
      required: true,
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
        fields: ['http.auth.token.token'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
