export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'ebay',
    '/rest/authType': 'oauth',
    '/rest/oauth/useIClientFields': false,
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
    '/rest/scope':
      formValues['/accountType'] === 'sandbox'
        ? formValues['/rest/scopeSandbox']
        : formValues['/rest/scopeProduction'],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    accountType: {
      id: 'accountType',
      type: 'select',
      label: 'Environment',
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
    'rest._iClientId': {
      id: 'rest._iClientId',
      resourceType: 'iClients',
      filter: { provider: 'ebay' },
      label: 'iClient',
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
    },
    'rest.scopeSandbox': {
      id: 'rest.scopeSandbox',
      type: 'selectscopes',
      isLoggable: true,
      label: 'Configure scopes',
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
    restAdvanced: { fieldId: 'restAdvanced' },
    'rest.scopeProduction': {
      id: 'rest.scopeProduction',
      type: 'selectscopes',
      isLoggable: true,
      label: 'Configure scopes',
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
  },
  layout: {
    fields: [
      'name',
      'accountType',
      'rest.scopeSandbox',
      'rest.scopeProduction',
      'rest._iClientId',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced', fields: ['restAdvanced'] },
    ],
  },
};
