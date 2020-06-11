export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };

    if (
      resource &&
      !resource._connectorId &&
      resource.http &&
      resource.http._iClientId
    ) {
      retValues['/http/_iClientId'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'squareup',
      '/http/auth/type': 'oauth',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/v2/locations',
      '/http/baseURI': 'https://connect.squareup.com',
      '/http/auth/oauth/authURI':
        'https://connect.squareup.com/oauth2/authorize',
      '/http/auth/oauth/tokenURI': 'https://connect.squareup.com/oauth2/token',
      '/http/auth/oauth/scopeDelimiter': ' ',
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
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
      ],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.oauth.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
