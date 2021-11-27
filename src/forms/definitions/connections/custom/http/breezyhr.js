export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'breezyhr',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/user/details',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.breezy.hr/v3',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': '',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshRelativeURI': 'https://api.breezy.hr/v3/signin',
    '/http/auth/token/refreshBody': '{ "email": "{{{connection.http.unencrypted.email}}}", "password": "{{{connection.http.encrypted.password}}}" }',
    '/http/auth/token/refreshTokenPath': 'token',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.email': {
      id: 'http.unencrypted.email',
      type: 'text',
      label: 'Email',
      required: true,
      helpKey: 'breezyhr.connection.http.unencrypted.email',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Password',
      required: true,
      helpKey: 'breezyhr.connection.http.encrypted.password',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.email', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
      label: 'Generate token',
      inputboxLabel: 'Token',
      defaultValue: '',
      required: true,
      helpKey: 'breezyhr.connection.http.auth.token.token',

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
        fields: ['http.unencrypted.email',
          'http.encrypted.password',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
