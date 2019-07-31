export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'onelogin',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.${
      formValues['/http/oneloginRegion']
    }.onelogin.com/api`,
    '/http/token/location': 'header',
    '/http/token/headerName': 'Authorization',
    '/http/token/scheme': 'Bearer',
    '/http/token/refreshMethod': 'POST',
    '/http/token/refreshBody':
      '{"grant_type":"refresh_token", "access_token":"{{{connection.http.auth.token.token}}}", "refresh_token":"{{{connection.http.auth.token.refreshToken}}}"}',
    '/http/token/refreshHeaders': [
      { name: 'Content-Type', value: 'application/json' },
    ],
    '/http/ping/relativeURI': `/1/users`,
    '/http/ping/method': `GET`,
  }),
  fields: [
    {
      id: 'http.oneloginRegion',
      type: 'text',
      startAdornment: 'https://api.',
      endAdornment: '.onelogin.com/api',
      label: 'Region:',
      helpText: 'Please enter Region for URI.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(12, baseUri.indexOf('.onelogin.com/api'));

        return subdomain;
      },
    },
    {
      id: 'http.unencrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      helpText: 'Please enter API Key of your OneLogin Account.',
    },
    {
      id: 'http.encrypted.apiSecret',
      required: true,
      defaultValue: '',
      type: 'text',
      label: 'API Secret:',
      inputType: 'password',
      helpText:
        'Please enter API Secret of your OneLogin Account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
    },

    {
      id: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      defaultValue: '',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'http.encrypted.apiKey',
          is: [''],
        },
        {
          field: 'http.encrypted.apiSecret',
          is: [''],
        },
        {
          field: 'http.oneloginRegion',
          is: [''],
        },
      ],
      label: 'Token Generator',
      helpText: 'The access token of your OneLogin account.',
    },

    {
      id: 'http.auth.token.refreshToken',
      type: 'text',
      label: 'refresh Token',
      visible: false,
    },
    { fieldId: 'http.disableStrictSSL' },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'http.concurrencyLevel' },
  ],
};
