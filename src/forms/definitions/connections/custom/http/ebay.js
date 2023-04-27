import { getEbayType } from '../../../../../utils/connections';

export default {
  preSave: formValues => {
    const apiType = formValues['/http/unencrypted/apiType'];

    if (apiType === 'ebayfinance') {
      return {
        ...formValues,
        '/type': 'http',
        '/assistant': 'ebayfinance',
        '/http/auth/type': 'oauth',
        '/http/mediaType': 'json',
        '/http/auth/token/refreshMethod': 'POST',
        '/http/auth/token/refreshMediaType': 'urlencoded',
        '/http/baseURI': `https://apiz${
          formValues['/accountType'] === 'sandbox' ? '.sandbox' : ''
        }.ebay.com/`,
        '/http/ping/relativeURI': '/sell/finances/v1/transaction',
        '/http/auth/oauth/useIClientFields': false,
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
      };
    }

    return {
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
      '/http/ping/relativeURI': 'sell/fulfillment/v1/order',
      '/http/auth/oauth/useIClientFields': false,
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
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.apiType': {
      id: 'http.unencrypted.apiType',
      type: 'select',
      label: 'API type',
      helpKey: 'ebay.connection.http.unencrypted.apiType',
      required: true,
      defaultValue: r => getEbayType(r),
      options: [
        {
          items: [
            { label: 'Other API', value: 'ebay' },
            { label: 'Finance API', value: 'ebayfinance' },
          ],
        },
      ],
    },
    accountType: {
      id: 'accountType',
      type: 'select',
      label: 'Account type',
      required: true,
      helpKey: 'ebay.connection.accountType',
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
      isLoggable: true,
      label: 'Configure scopes',
      visibleWhen: [{ field: 'accountType', is: ['sandbox'] }],
      scopes: [
        {
          subHeader: 'Finance API',
          scopes: [
            'https://api.ebay.com/oauth/api_scope/sell.finances',
          ],
        },
        {
          subHeader: 'Other APIs',
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
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.includes('sandbox')) {
            return (
              (r &&
                r.http &&
                r.http.auth &&
                r.http.auth.oauth &&
                r.http.auth.oauth.scope) ||
              []
            );
          }
        }

        return [];
      },
    },
    'http.scopeProduction': {
      id: 'http.scopeProduction',
      type: 'selectscopes',
      isLoggable: true,
      label: 'Configure scopes',
      scopes: [
        {
          subHeader: 'Finance API',
          scopes: [
            'https://api.ebay.com/oauth/api_scope/sell.finances',
          ],
        },
        {
          subHeader: 'Other APIs',
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
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (!baseUri.includes('sandbox')) {
            return (
              (r &&
                r.http &&
                r.http.auth &&
                r.http.auth.oauth &&
                r.http.auth.oauth.scope) ||
              []
            );
          }
        }

        return [];
      },
      visibleWhen: [{ field: 'accountType', is: ['production'] }],
    },
    'http._iClientId': {
      id: 'http._iClientId',
      resourceType: 'iClients',
      filter: { provider: 'ebay' },
      connType: 'ebay',
      label: 'iClient',
      hideFromUI: true,
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
    },
    'http.unencrypted.apiSiteId': {
      id: 'http.unencrypted.apiSiteId',
      type: 'select',
      label: 'API site ID',
      defaultValue: r =>
        (r && r.http && r.http.unencrypted && r.http.unencrypted.apiSiteId) ||
        '0',
      options: [
        {
          items: [
            { value: '16', label: 'eBay Austria - 16' },
            { value: '15', label: 'eBay Australia - 15' },
            { value: '193', label: 'eBay Switzerland - 193' },
            { value: '77', label: 'eBay Germany - 77' },
            { value: '2', label: 'eBay Canada (English) - 2' },
            { value: '186', label: 'eBay Spain - 186' },
            { value: '71', label: 'eBay France - 71' },
            { value: '23', label: 'eBay Belgium (French) - 23' },
            { value: '210', label: 'eBay Canada (French) - 210' },
            { value: '3', label: 'eBay UK - 3' },
            { value: '201', label: 'eBay Hong Kong - 201' },
            { value: '205', label: 'eBay Ireland - 205' },
            { value: '203', label: 'eBay India - 203' },
            { value: '101', label: 'eBay Italy - 101' },
            { value: '100', label: 'eBay Motors - 100' },
            { value: '207', label: 'eBay Malaysia - 207' },
            { value: '146', label: 'eBay Netherlands - 146' },
            { value: '123', label: 'eBay Belgium (Dutch) - 123' },
            { value: '211', label: 'eBay Philippines - 211' },
            { value: '212', label: 'eBay Poland - 212' },
            { value: '216', label: 'eBay Singapore - 216' },
            { value: '0', label: 'eBay United States - 0' },
          ],
        },
      ],
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application', 'http.unencrypted.apiType'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'accountType',
          'http.scopeSandbox',
          'http.scopeProduction',
          'http._iClientId',
          'http.unencrypted.apiSiteId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
