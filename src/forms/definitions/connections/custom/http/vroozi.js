export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'vroozi',
    '/http/auth/type': 'token',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': ' ',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/accountType'] === 'sandbox' ? 'sandbox-' : ''
    }api.vroozi.com/v1`,
    '/http/ping/relativeURI': '/company-codes',
    '/http/ping/method': 'GET',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 10,
    '/http/headers': [
      {
        name: 'x-api-key',
        value: '{{{connection.http.unencrypted.apiKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    accountType: {
      id: 'accountType',
      type: 'select',
      label: 'Account type',
      required: true,
      helpKey: 'vroozi.connection.accountType',
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
    'http.unencrypted.apiKey': {
      id: 'http.unencrypted.apiKey',
      type: 'text',
      label: 'API key',
      helpKey: 'vroozi.connection.http.unencrypted.apiKey',
      required: true,
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Access token',
      helpKey: 'vroozi.connection.http.auth.token.token',
      required: true,
    },
    application: { id: 'application', type: 'text', label: 'Application', defaultValue: r => r && r.assistant ? r.assistant : r.type, defaultDisabled: true, },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['accountType',
          'http.unencrypted.apiKey',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
