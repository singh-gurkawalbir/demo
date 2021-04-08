export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'walmartmexico',
    '/http/auth/type': 'token',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'WM_SEC.ACCESS_TOKEN',
    '/http/auth/token/scheme': ' ',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'sandbox' : 'marketplace'
    }.walmartapis.com/v3`,
    '/http/ping/relativeURI': '/feeds',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'Authorization',
        value:
            'Basic {{{base64Encode (join ":" connection.http.unencrypted.clientId connection.http.encrypted.clientSecret)}}}',
      },
      {
        name: 'WM_SVC.NAME',
        value: 'Walmart Marketplace',
      },
      {
        name: 'WM_QOS.CORRELATION_ID',
        value: "{{{dateFormat 'X'}}}",
      },
      {
        name: 'WM_MARKET',
        value: 'mx',
      },
      {
        name: 'WM_CONSUMER.CHANNEL.TYPE',
        value: '511b6430-8bb3-475c-97e2-3bb5ed066780',
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
      {
        name: 'Authorization',
        value:
            'Basic {{{base64Encode (join ":" connection.http.unencrypted.clientId connection.http.encrypted.clientSecret)}}}',
      },
      {
        name: 'WM_SVC.NAME',
        value: 'Walmart Marketplace',
      },
      {
        name: 'WM_QOS.CORRELATION_ID',
        value: "{{{dateFormat 'X'}}}",
      },
      {
        name: 'WM_MARKET',
        value: 'mx',
      },
      {
        name: 'WM_CONSUMER.CHANNEL.TYPE',
        value: '511b6430-8bb3-475c-97e2-3bb5ed066780',
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
      helpKey: 'walmartmexico.connection.environment',
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
      helpKey: 'walmartmexico.connection.http.unencrypted.clientId',
      required: true,
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      type: 'text',
      label: 'Client Secret',
      helpKey: 'walmartmexico.connection.http.encrypted.clientSecret',
      required: true,
      inputType: 'password',
      defaultValue: '',
      description:
          'Note: for security reasons this field must always be re-entered.',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['environment',
          'http.unencrypted.clientId',
          'http.encrypted.clientSecret'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
