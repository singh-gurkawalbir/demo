export default {
  preSubmit: formValues => ({
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
  fields: [
    { fieldId: 'name' },
    {
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
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
