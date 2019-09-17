export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'grms',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://sandbox-api.globalrms.com/api/',
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': '',
    '/http/auth/token/headerName': 'AccessToken',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/ratings',
    '/http/auth/token/refreshRelativeURI':
      'https://sandbox-api.globalrms.com/api/accessToken',
    '/http/auth/token/refreshBody':
      '{"ApiKey":"{{{connection.http.unencrypted.apiKey}}}","ApiSecret":"{{{connection.http.encrypted.apiSecret}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshTokenPath': 'token.TransactionID',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshHeaders': [
      {
        name: 'Content-Type',
        value: 'application/json',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.unencrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key',
      helpText:
        'GRMS assigned API key to a partner account. API key is given out by GRMS customer support team.',
    },
    {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'API Secret',
      inputType: 'password',
      helpText:
        'GRMS assigned API secret to a partner account. API secret is given out by GRMS customer support team.',
    },
    {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'http.unencrypted.apiKey',
          is: [''],
        },
        {
          field: 'http.encrypted.apiSecret',
          is: [''],
        },
      ],
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The Access Token of your GRMS account',
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
