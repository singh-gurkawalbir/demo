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
