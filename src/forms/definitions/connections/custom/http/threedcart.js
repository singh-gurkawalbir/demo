export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': '3dcart',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/3dCartWebAPI/v1/Customers',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://apirest.3dcart.com`,
    '/http/auth/token/headerName': 'Token',
    '/http/auth/token/scheme': ' ',
    '/http/auth/token/location': 'header',
    '/http/headers': [
      {
        name: 'SecureUrl',
        value: formValues['/http/threedcartSecureUrl'],
      },
      {
        name: 'PrivateKey',
        value: '{{{connection.http.encrypted.PrivateKey}}}',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.threedcartSecureUrl',
      type: 'text',
      label: 'Secure URL',
      required: true,
      helpText: `3dcart merchant's Secure URL.`,
      defaultValue: r =>
        r &&
        r.http &&
        r.http.headers &&
        r.http.headers.find(header => header.name === 'SecureUrl') &&
        r.http.headers.find(header => header.name === 'SecureUrl').value,
    },
    {
      id: 'http.encrypted.PrivateKey',
      type: 'text',
      label: 'Private Key',
      defaultValue: '',
      required: true,
      helpText: `Your application's private key.`,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      fieldId: 'http.auth.token.token',
      required: true,
      helpText: `The 3dcart merchant's token.`,
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
