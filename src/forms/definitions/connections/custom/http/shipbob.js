export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shipbob',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.shipbob.com/1.0',
    '/http/ping/relativeURI': '/inventory',
    '/http/ping/method': 'GET',
    '/http/auth/oauth/authURI': 'https://auth.shipbob.com/connect/integrate',
    '/http/auth/oauth/tokenURI': 'https://auth.shipbob.com/connect/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/oauth/scope': [
      ...['inventory_read'],
      ...formValues['/http/auth/oauth/scope'],
    ],
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 2,
  }),
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
          : ['channels_read'],
      scopes: [
        'inventory_read',
        'receiving_read',
        'receiving_write',
        'channels_read',
        'orders_read',
        'orders_write',
        'products_read',
        'products_write',
        'fulfillments_read',
        'offline_access',
        'returns_write',
        'returns_read',
      ],
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
        fields: ['http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
