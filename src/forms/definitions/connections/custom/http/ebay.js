export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'ebay',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/baseURI': `https://api${
      formValues['/accountType'] === 'sandbox' ? '.sandbox' : ''
    }.ebay.com/`,
    '/http/auth/oauth/authURI': `https://signin${
      formValues['/accountType'] === 'sandbox' ? '.sandbox' : ''
    }.ebay.com/authorize`,
    '/http/auth/oauth/tokenURI': `https://api${
      formValues['/accountType'] === 'sandbox' ? '.sandbox' : ''
    }.ebay.com/identity/v1/oauth2/token`,
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/scope':
      formValues['/accountType'] === 'sandbox'
        ? formValues['/http/scopeSandbox']
        : formValues['/http/scopeProduction'],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    accountType: {
      id: 'accountType',
      type: 'select',
      label: 'Account Type',
      helpText:
        'Please select your environment here. Select Sandbox Accounting if the account is created on https://sandbox-quickbooks.api.intuit.com. Select Sandbox Payment if the account is created on https://sandbox.api.intuit.com. Select Production Accounting if the account is created on https://quickbooks.api.intuit.com. Select Production Payment if the account is created on https://api.intuit.com.',
      options: [
        {
          items: [
            { label: 'Sandbox', value: 'sandbox' },
            { label: 'Production', value: 'production' },
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
    'http.scopeSandbox': {
      id: 'http.scopeSandbox',
      type: 'selectscopes',
      label: 'Configure Scopes',
      visibleWhen: [{ field: 'accountType', is: ['sandbox'] }],
      scopes: [
        'https://api.ebay.com/oauth/api_scope',
        'https://api.ebay.com/oauth/api_scope/buy.order.readonly',
        'https://api.ebay.com/oauth/api_scope/buy.guest.order',
        'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.marketing',
        'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.inventory',
        'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.account',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
        'https://api.ebay.com/oauth/api_scope/sell.analytics.readonly',
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') !== -1) {
            return (r && r.http && r.http.scope) || [];
          }
        }

        return [];
      },
      required: true,
    },
    'http.scopeProduction': {
      id: 'http.scopeProduction',
      type: 'selectscopes',
      label: 'Configure Scopes',
      scopes: [
        'https://api.ebay.com/oauth/api_scope',
        'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.marketing',
        'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.inventory',
        'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.account',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
        'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
        'https://api.ebay.com/oauth/api_scope/sell.analytics.readonly',
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') === -1) {
            return (r && r.http && r.http.scope) || [];
          }
        }

        return [];
      },
      visibleWhen: [{ field: 'accountType', is: ['production'] }],
      required: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'accountType',
      'http.scopeSandbox',
      'http.scopeProduction',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
