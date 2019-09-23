export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'lightspeed',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.merchantos.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://cloud.merchantos.com/oauth/authorize.php',
    '/rest/oauthTokenURI':
      'https://cloud.merchantos.com/oauth/access_token.php',
    '/rest/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.scope': {
      fieldId: 'rest.scope',
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
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
