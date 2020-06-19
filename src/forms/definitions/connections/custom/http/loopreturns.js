export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'loopreturns',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.loopreturns.com/api/v1',
    '/http/ping/relativeURI': '/blacklists',
    '/http/ping/method': 'GET',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-Authorization',
    '/http/auth/token/scheme': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      helpKey: 'loopreturns.connection.http.auth.token.token',
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
