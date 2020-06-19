export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'skubana',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.${
      formValues['/environment'] === 'sandbox' ? 'sandbox.' : ''
    }skubana.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'demo' : 'app'
    }.skubana.com/oauth/authorize`,
    '/http/auth/oauth/tokenURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'demo' : 'app'
    }.skubana.com/oauth/token`,
    '/http/auth/oauth/accessTokenPath': 'access_token',
    '/http/auth/oauth/scopeDelimiter': '+',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      helpKey: 'skubana.connection.environment',
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
          if (baseUri.indexOf('sandbox.') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'none',
        'read_inventory',
        'write_inventory',
        'read_orders',
        'write_orders',
        'read_shipments',
        'write_shipments',
        'read_products',
        'write_products',
        'read_purchaseorders',
        'write_purchaseorders',
        'read_analytics',
        'all',
      ],
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
        fields: ['environment', 'http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
