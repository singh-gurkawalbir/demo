export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'asana',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/1.0/users',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://app.asana.com/api',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
      label: 'Personal access token',
      helpKey: 'asana.connection.http.auth.token.token',
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
