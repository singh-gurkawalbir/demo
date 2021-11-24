export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'copper',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/companies/search',
    '/http/ping/method': 'POST',
    '/http/baseURI': 'https://api.copper.com/developer_api/v1',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'X-PW-AccessToken',
    '/http/auth/token/scheme': '',
    '/http/headers': [
      {
        name: 'X-PW-Application',
        value: 'developer_api',
      },
      {
        name: 'X-PW-UserEmail',
        value: '{{{connection.http.unencrypted.email}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API key',
      helpKey: 'copper.connection.http.auth.token.token',
      required: true,
    },
    'http.unencrypted.email': {
      type: 'text',
      fieldId: 'http.unencrypted.email',
      label: 'Email ID',
      helpKey: 'copper.connection.http.unencrypted.email',
      required: true,
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.token.token',
          'http.unencrypted.email'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
