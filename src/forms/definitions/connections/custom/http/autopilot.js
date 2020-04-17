export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'autopilot',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'v1/contacts',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api2.autopilothq.com/`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'autopilotapikey',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API Key',
      helpKey: 'autopilot.connection.http.auth.token.token',
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
