export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'skubana',
    '/rest/baseURI': `https://api.${
      formValues['/environment'] === 'sandbox' ? '.sandbox' : ''
    }skubana.com`,
    '/rest/tokenLocation': 'header',
    '/rest/authURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'demo' : 'app'
    }ß.skubana.com/oauth/authorize`,
    '/rest/oauthTokenURI': `https://${
      formValues['/environment'] === 'sandbox' ? 'demo' : 'app'
    }.skubana.com/oauth/token`,
    '/rest/oauth/accessTokenPath': 'access_token',
    '/rest/scopeDelimiter': '+',
  }),
  fields: [
    { fieldId: 'name' },
    {
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
        'Please select your environment here. Select Sandbox if the account is created on https://staging.integrator.io. Select Production if the account is created on https://integrator.io.',
      defaultValue: r => {
        const baseUri = r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox.') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    {
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
  ],
};
