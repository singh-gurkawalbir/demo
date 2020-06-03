export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'walmart',
    '/http/auth/type': 'token',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'WM_SEC.ACCESS_TOKEN',
    '/http/auth/token/scheme': ' ',
    '/http/mediaType': 'xml',
    '/http/baseURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'sandbox' : 'marketplace'
    }.walmartapis.com/v3`,
    '/http/ping/relativeURI': '/feeds',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'authorization',
        value:
          'Basic {{{base64Encode (join ":" connection.http.unencrypted.clientId connection.http.encrypted.clientSecret)}}}',
      },
      {
        name: 'wm_svc.name',
        value: 'Walmart Marketplace',
      },
      {
        name: 'wm_qos.correlation_id',
        value: "{{{dateFormat 'X'}}}",
      },
    ],
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/token/refreshRelativeURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'sandbox' : 'marketplace'
    }.walmartapis.com/v3/token`,
    '/http/auth/token/refreshBody': '{"grant_type":"client_credentials"}',
    '/http/auth/token/refreshTokenPath': 'access_token',
    '/http/auth/token/refreshHeaders': [
      {
        name: 'accept',
        value: 'application/json',
      },
      {
        name: 'Content-Type',
        value: 'application/x-www-form-urlencoded',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      required: true,
      helpKey: 'walmart.connection.environment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') === -1) {
            return 'production';
          }
        }

        return 'sandbox';
      },
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      type: 'text',
      label: 'Client ID',
      helpKey: 'walmart.connection.http.unencrypted.clientId',
      required: true,
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      label: 'Client Secret',
      helpKey: 'walmart.connection.http.encrypted.clientSecret',
      required: true,
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'environment',
      'http.unencrypted.clientId',
      'http.encrypted.clientSecret',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
