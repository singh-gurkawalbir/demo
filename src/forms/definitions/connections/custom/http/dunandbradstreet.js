export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'dunandbradstreet',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://direct.dnb.com/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': '',
    '/http/auth/token/headerName': 'Authorization',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/V7.1/monitoring/changenotices',
    '/http/auth/token/refreshRelativeURI':
      'https://direct.dnb.com/Authentication/V2.0',
    '/http/auth/token/refreshBody':
      'x-dnb-user: {{{connection.http.unencrypted.username}}}\r\nx-dnb-pwd: {{{connection.http.encrypted.password}}}',
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
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.unencrypted.username',
      required: true,
      type: 'text',
      label: 'Username',
      helpText: 'Please enter username of your Dun & Bradstreet account.',
    },

    {
      id: 'http.encrypted.password',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Password',
      inputType: 'password',
      helpText: 'Please enter password of your Dun & Bradstreet account.',
    },
    {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'http.unencrypted.username',
          is: [''],
        },
        {
          field: 'http.encrypted.password',
          is: [''],
        },
      ],
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The access token of your Dun & Bradstreet account.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
