export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'X-Auth-Token';
      retValues['/http/auth/token/scheme'] = ' ';
      retValues['/http/auth/basic/username'] = undefined;
      retValues['/http/auth/basic/password'] = undefined;
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/oauth/scopeDelimiter'] = undefined;
      retValues['/http/auth/oauth/scope'] = undefined;
      retValues['/http/headers'] = [
        {
          name: 'X-Auth-Client',
          value: retValues['/http/unencrypted/clientId'],
        },
      ];
    } else if (retValues['/http/auth/type'] === 'oauth') {
      retValues['/http/auth/oauth/authURI'] =
        'https://login.bigcommerce.com/oauth2/authorize';
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/oauth/tokenURI'] =
        'https://login.bigcommerce.com/oauth2/token';
      retValues['/http/auth/oauth/scopeDelimiter'] = '+';
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'X-Auth-Token';
      retValues['/http/auth/token/scheme'] = undefined;
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/basic/username'] = undefined;
      retValues['/http/auth/basic/password'] = undefined;
      retValues['/http/headers'] = undefined;
    } else {
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/oauth/scopeDelimiter'] = undefined;
      retValues['/http/auth/oauth/scope'] = undefined;
      retValues['/http/headers'] = [
        {
          name: 'X-Auth-Token',
          value: retValues['/http/auth/basic/password'],
        },
        {
          name: 'X-Auth-Client',
          value: retValues['/http/auth/basic/username'],
        },
      ];
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'bigcommerce',
      '/http/baseURI': `https://api.bigcommerce.com/stores/${
        formValues['/storeHash']
      }`,
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/v2/store',
      '/http/ping/method': 'GET',
      '/http/ping/successPath': 'id',
    };
  },

  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.type,
      label: 'Authentication type',
      helpKey: 'bigcommerce.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Basic', value: 'basic' },
            { label: 'Token', value: 'token' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'bigcommerce.connection.http.auth.basic.username',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'bigcommerce.connection.http.auth.basic.password',
      visibleWhen: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      defaultValue: '',
      label: 'Access token',
      required: true,
      helpKey: 'bigcommerce.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client ID',
      helpKey: 'bigcommerce.connection.http.unencrypted.clientId',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    storeHash: {
      id: 'storeHash',
      required: true,
      type: 'text',
      label: 'Store hash',
      visibleWhen: [
        { field: 'http.auth.type', is: ['token', 'basic', 'oauth'] },
      ],
      defaultValue: r => {
        let value = '';

        if (
          r &&
          r.http &&
          r.http.baseURI &&
          r.http.baseURI.indexOf('https://api.bigcommerce.com/stores/') !== -1
        ) {
          value = r.http.baseURI.replace(
            'https://api.bigcommerce.com/stores/',
            ''
          );
        }

        return value;
      },
    },
    genericOauthConnector: {
      formId: 'genericOauthConnector',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'store_v2_content',
        'store_v2_customers',
        'store_v2_default',
        'store_v2_information_read_only',
        'store_v2_marketing',
        'store_v2_orders',
        'store_v2_products',
        'users_basic_information',
      ],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
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
        fields: ['http.auth.type',
          'http.auth.basic.username',
          'http.auth.basic.password',
          'http.auth.token.token',
          'http.unencrypted.clientId',
          'storeHash',
          'http.auth.oauth.scope',
          'genericOauthConnector'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token', 'basic'],
        },
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
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
      id: 'cancel',
    },
    {
      id: 'test',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token', 'basic'],
        },
      ],
    },
  ],
};
