export default {
  preSave: formValues => {
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
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'squareup',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/v2/locations',
      '/http/baseURI': `https://connect.squareup.com`,
      '/http/ping/method': 'GET',
      // '/http/ping/successPath': 'locations',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication Type',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      helpText: 'Please select Authentication Type',
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
      label: 'Access Token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
      required: true,
      helpText:
        'Enter your access token for Square here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe.',
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
      label: 'Save & Authorize',
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
