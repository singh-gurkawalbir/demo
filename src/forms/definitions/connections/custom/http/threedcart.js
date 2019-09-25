export default {
  preSave: formValues => ({
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
  fieldMap: {
    name: { fieldId: 'name' },
    'http.threedcartSecureUrl': {
      id: 'http.threedcartSecureUrl',
      type: 'text',
      label: 'Secure URL',
      required: true,
      helpText: "3dcart merchant's Secure URL.",
      defaultValue: r =>
        r &&
        r.http &&
        r.http.headers &&
        r.http.headers.find(header => header.name === 'SecureUrl') &&
        r.http.headers.find(header => header.name === 'SecureUrl').value,
    },
    'http.encrypted.PrivateKey': {
      id: 'http.encrypted.PrivateKey',
      type: 'text',
      label: 'Private Key',
      defaultValue: '',
      required: true,
      helpText:
        "Your application's private key.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Private Key safe. This can be obtained from the Settings section and Private Key subsection.",
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
      helpText: "The 3dcart merchant's token.",
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.threedcartSecureUrl',
      'http.encrypted.PrivateKey',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
