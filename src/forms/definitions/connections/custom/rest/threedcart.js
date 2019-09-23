export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.threedcartSecureUrl': {
      id: 'rest.threedcartSecureUrl',
      type: 'text',
      label: 'Secure URL:',
      required: true,
      helpText: "3dcart merchant's Secure URL.",
      defaultValue: r =>
        r &&
        r.rest &&
        r.rest.headers &&
        r.rest.headers.find(header => header.name === 'SecureUrl') &&
        r.rest.headers.find(header => header.name === 'SecureUrl').value,
    },
    'rest.encrypted.PrivateKey': {
      id: 'rest.encrypted.PrivateKey',
      type: 'text',
      label: 'Private Key:',
      required: true,
      helpText: "Your application's private key.",
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'rest.bearerToken': {
      fieldId: 'rest.bearerToken',
      required: true,
      helpText: "The 3dcart merchant's token.",
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.threedcartSecureUrl',
      'rest.encrypted.PrivateKey',
      'rest.bearerToken',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
