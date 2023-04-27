export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'squareup',
      '/http/auth/type': 'oauth',
      '/http/auth/oauth/useIClientFields': false,
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/v2/locations',
      '/http/baseURI': `https://connect.${formValues['/accountType'] === 'sandbox' ? 'squareupsandbox' : 'squareup'}.com/`,
      '/http/auth/oauth/authURI': `https://connect.${formValues['/accountType'] === 'sandbox' ? 'squareupsandbox' : 'squareup'}.com/oauth2/authorize`,
      '/http/auth/oauth/tokenURI': `https://connect.${formValues['/accountType'] === 'sandbox' ? 'squareupsandbox' : 'squareup'}.com/oauth2/token`,
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
      '/http/auth/oauth/scopeDelimiter': ' ',
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    accountType: {
      id: 'accountType',
      type: 'select',
      label: 'Account type',
      required: true,
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      helpKey: 'squareup.connection.accountType',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('squareupsandbox') !== -1) {
            return 'sandbox';
          }

          return 'production';
        }
      },
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      defaultValue: r =>
        r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.scope
          ? r.http.auth.oauth.scope
          : ['MERCHANT_PROFILE_WRITE',
            'MERCHANT_PROFILE_READ'],
      scopes: [
        'BANK_ACCOUNTS_READ',
        'CUSTOMERS_READ',
        'CUSTOMERS_WRITE',
        'EMPLOYEES_READ',
        'EMPLOYEES_WRITE',
        'INVENTORY_READ',
        'INVENTORY_WRITE',
        'ITEMS_READ',
        'ITEMS_WRITE',
        'ORDERS_READ',
        'ORDERS_WRITE',
        'PAYMENTS_READ',
        'PAYMENTS_WRITE',
        'PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS',
        'PAYMENTS_WRITE_IN_PERSON',
        'SETTLEMENTS_READ',
        'TIMECARDS_READ',
        'TIMECARDS_WRITE',
        'TIMECARDS_SETTINGS_READ',
        'TIMECARDS_SETTINGS_WRITE',
        'CASH_DRAWER_READ',
        'MERCHANT_PROFILE_WRITE',
        'MERCHANT_PROFILE_READ',
      ],
      visibleWhenAll: r => {
        if (r?.http?._iClientId) {
          return [{ field: 'http.auth.type', isNot: ['oauth'] },
            { field: 'http.auth.type', isNot: ['basic'] }];
        }

        return [{ field: 'http.auth.type', is: ['oauth'] }];
      },
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      helpKey: 'squareup.connection.http._iClientId',
      visibleWhenAll: [{field: 'accountType', is: ['sandbox']}],
      remove: r => !!((r && !r._connectorId && r?.http && r?.http?._iClientId)),
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhenAll: [{field: 'accountType', is: ['sandbox']}],
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
        fields: ['accountType', 'http.auth.oauth.scope', 'http._iClientId', 'http.auth.oauth.callbackURL'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
