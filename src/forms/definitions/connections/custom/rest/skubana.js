export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'skubana',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.${
      formValues['/environment'] === 'sandbox' ? '.sandbox' : ''
    }skubana.com`,
    '/rest/tokenLocation': 'header',
    '/rest/authURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'demo' : 'app'
    }.skubana.com/oauth/authorize`,
    '/rest/oauthTokenURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'demo' : 'app'
    }.skubana.com/oauth/token`,
    '/rest/oauth/accessTokenPath': 'access_token',
    '/rest/scopeDelimiter': '+',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment:',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'sandbox', value: 'Sandbox' },
          ],
        },
      ],
      helpText:
        'Please select your environment here. Select Sandbox if the account is created on https://demo.skubana.com/login. Select Production if the account is created on https://app.skubana.com/login.',
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox.') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'rest.scope': {
      fieldId: 'rest.scope',
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
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'environment', 'rest.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
