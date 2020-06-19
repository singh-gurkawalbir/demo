export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'lightspeed',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.merchantos.com',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI':
      'https://cloud.merchantos.com/oauth/authorize.php',
    '/http/auth/oauth/tokenURI':
      'https://cloud.merchantos.com/oauth/access_token.php',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'employee:all',
        'employee:register',
        'employee:register_read',
        'employee:inventory',
        'employee:reports',
        'employee:admin',
        'employee:admin_shops',
        'employee:admin_employees',
        'employee:admin_purchases',
        'employee:admin_void_sale',
        'employee:admin_inventory',
        'employee:customers',
        'employee:customers_read',
        'employee:customers_credit_limit',
      ],
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
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
