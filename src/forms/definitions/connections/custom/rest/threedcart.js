export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': '3dcart',
    '/rest/authType': 'token',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/3dCartWebAPI/v1/Customers',
    '/rest/baseURI': `https://apirest.3dcart.com`,
    '/rest/authHeader': 'Token',
    '/rest/authScheme': ' ',
    '/rest/tokenLocation': 'header',
    '/rest/headers': [
      {
        name: 'SecureUrl',
        value: '{{{connection.rest.unencrypted.threedcartSecureUrl}}}',
      },
      {
        name: 'PrivateKey',
        value: '{{{connection.rest.encrypted.PrivateKey}}}',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.unencrypted.threedcartSecureUrl',
      type: 'text',
      label: 'Secure URL:',
      required: true,
      helpText: `3dcart merchant's Secure URL.`,
    },
    {
      id: 'rest.encrypted.PrivateKey',
      type: 'text',
      label: 'Private Key:',
      inputType: 'password',
      required: true,
      helpText: `Your application's private key.`,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      fieldId: 'rest.bearerToken',
      required: true,
      helpText: `The 3dcart merchant's token.`,
    },
  ],
};
