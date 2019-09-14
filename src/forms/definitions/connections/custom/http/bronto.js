export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'bronto',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://rest.bronto.com/',
    '/http/token/location': 'header',
    '/http/token/scheme': 'Bearer',
    '/http/token/headerName': 'Authorization',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': 'campaigns',
    '/http/auth/token/refreshRelativeURI':
      'https://auth.bronto.com/oauth2/token',
    '/http/auth/token/refreshBody':
      '{"grant_type":"client_credentials","client_id":"{{{connection.http.unencrypted.clientId}}}","client_secret":"{{{connection.http.encrypted.clientSecret}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fields: [
    {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client ID:',
      helpText: 'Please enter Client ID of your Bronto Account.',
    },

    {
      id: 'http.encrypted.clientSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Client Secret:',
      inputType: 'password',
      helpText:
        'Please enter Client Secret of your Bronto Account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
    },
    {
      id: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'http.unencrypted.clientId',
          is: [''],
        },
        {
          field: 'http.encrypted.clientSecret',
          is: [''],
        },
      ],
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The access token of your Bronto account.',
    },
    {
      id: 'http.refreshToken',
      type: 'text',
      visible: false,
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
