export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'ebay',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api${
      formValues['/accountType'] === 'sandbox' ? '.sandbox' : ''
    }.ebay.com/`,
    '/rest/authURI': `https://signin${
      formValues['/accountType'] === 'sandbox' ? '.sandbox' : ''
    }.ebay.com/authorize`,
    '/rest/oauthTokenURI': `https://api${
      formValues['/accountType'] === 'sandbox' ? '.sandbox' : ''
    }.ebay.com/identity/v1/oauth2/token`,
    '/rest/scopeDelimiter': ' ',
    '/rest/tokenLocation': 'header',
    '/rest/scope': `${
      formValues['/accountType'] === 'sandbox'
        ? formValues['/rest/scopeSandbox']
        : formValues['/rest/scopeProduction']
    }`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'accountType',
      type: 'select',
      label: 'Account Type:',
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
        const baseUri = r && r.rest && r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') === -1) {
            return 'production';
          }
        }

        return 'sandbox';
      },
    },
    {
      id: 'rest.scopeSandbox',
      type: 'selectscopes',
      label: 'Configure Scopes',
      visibleWhen: [
        {
          field: 'accountType',
          is: ['sandbox'],
        },
      ],
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
        const baseUri = r && r.rest && r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') !== -1) {
            return r && r.rest && r.rest.scope;
          }
        }

        return [];
      },
    },
    {
      id: 'rest.scopeProduction',
      type: 'selectscopes',
      label: 'Configure Scopes',
      scopes: [
        'https://api.ebay.com/oauth/api_scope',
        // 'https://api.ebay.com/oauth/api_scope/buy.order.readonly',
        // 'https://api.ebay.com/oauth/api_scope/buy.guest.order',
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
        const baseUri = r && r.rest && r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') === -1) {
            return r && r.rest && r.rest.scope;
          }
        }

        return [];
      },
      visibleWhen: [
        {
          field: 'accountType',
          is: ['production'],
        },
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
