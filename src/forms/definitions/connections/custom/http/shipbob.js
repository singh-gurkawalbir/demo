export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shipbob',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.shipbob.com/1.0',
    '/http/auth/oauth/authURI': 'https://auth.shipbob.com/connect/integrate',
    '/http/auth/oauth/tokenURI': 'https://auth.shipbob.com/connect/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 2,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
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
      ],
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
