export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'skubana',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://${
      formValues['/http/unencrypted/subdomain']
    }.skubana.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'demo' : 'app'
    }.skubana.com/oauth/authorize`,
    '/http/auth/oauth/tokenURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'demo' : 'app'
    }.skubana.com/oauth/token`,
    '/http/auth/oauth/accessTokenPath': 'access_token',
    '/http/auth/oauth/scopeDelimiter': '+',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      required: true,
      helpKey: 'skubana.environment',
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
          if (baseUri.indexOf('demo') !== -1) {
            return 'sandbox';
          }
          if (baseUri.indexOf('sandbox') !== -1) {
            return 'sandbox';
          }
          if (baseUri.indexOf('api.skubana') !== -1) {
            return 'production';
          }

          return '';
        }
      },
    },
    'http.unencrypted.subdomain': {
      fieldId: 'http.unencrypted.subdomain',
      startAdornment: 'https://',
      endAdornment: '.skubana.com',
      type: 'updatedomain',
      label: 'Subdomain',
      helpKey: 'skubana.connection.http.unencrypted.subdomain',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
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
        fields: ['environment', 'http.unencrypted.subdomain', 'http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
