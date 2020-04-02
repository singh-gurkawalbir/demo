export default {
  preSave: (formValues, resource) => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/oauth/scope'] = undefined;
    } else {
      retValues['/http/auth/oauth/authURI'] =
        'https://connect.squareup.com/oauth2/authorize';
      retValues['/http/auth/oauth/tokenURI'] =
        'https://connect.squareup.com/oauth2/token';
      retValues['/http/auth/oauth/scopeDelimiter'] = ' ';
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/token/location'] = undefined;
      retValues['/http/auth/token/headerName'] = undefined;
      retValues['/http/auth/token/scheme'] = undefined;

      if (
        resource &&
        !resource._connectorId &&
        resource.http &&
        resource.http._iClientId
      ) {
        retValues['/http/_iClientId'] = undefined;
      }
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'squareup',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/v2/locations',
      '/http/baseURI': `https://connect.squareup.com`,
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication type',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      options: [
        {
          items: [
            { label: 'Token', value: 'token' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Access token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
      required: true,
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
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
        'MERCHANT_PROFILE_READ',
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
        'MERCHANT_PROFILE_WRITE',
        'CASH_DRAWER_READ',
      ],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.type',
      'http.auth.token.token',
      'http.auth.oauth.scope',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'cancel',
    },
    {
      id: 'oauth',
      label: 'Save & authorize',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'test',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
  ],
};
