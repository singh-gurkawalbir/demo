export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'dunandbradstreet',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://direct.dnb.com/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': ' ',
    '/http/auth/token/headerName': 'Authorization',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/V7.1/monitoring/changenotices',
    '/http/auth/token/refreshRelativeURI':
      'https://direct.dnb.com/Authentication/V2.0',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshTokenPath': 'AuthenticationDetail.Token',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshHeaders': [
      {
        name: 'x-dnb-user',
        value: `${formValues['/http/unencrypted/username']}`,
      },
      {
        name: 'x-dnb-pwd',
        value: `${formValues['/http/encrypted/password']}`,
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      required: true,
      type: 'text',
      label: 'Username',
      helpKey: 'dunandbradstreet.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Password',
      inputType: 'password',
      helpKey: 'dunandbradstreet.connection.http.encrypted.password',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.username', is: [''] },
        { field: 'http.encrypted.password', is: [''] },
      ],
      label: 'Generate token',
      defaultValue: '',
      required: true,
      helpKey: 'dunandbradstreet.connection.http.auth.token.token',
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
        fields: ['http.unencrypted.username',
          'http.encrypted.password',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
