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
        value: formValues['/rest/threedcartSecureUrl'],
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
      id: 'rest.threedcartSecureUrl',
      type: 'text',
      label: 'Secure URL:',
      required: true,
      helpText: `3dcart merchant's Secure URL.`,
      defaultValue: r =>
        r &&
        r.rest &&
        r.rest.headers &&
        r.rest.headers.find(header => header.name === 'SecureUrl') &&
        r.rest.headers.find(header => header.name === 'SecureUrl').value,
    },
    {
      id: 'rest.encrypted.PrivateKey',
      type: 'text',
      label: 'Private Key:',
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
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
