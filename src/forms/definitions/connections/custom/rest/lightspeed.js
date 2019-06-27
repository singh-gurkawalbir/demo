export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'lightspeed',
    '/rest/baseURI': 'https://api.merchantos.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://cloud.merchantos.com/oauth/authorize.php',
    '/rest/oauthTokenURI':
      'https://cloud.merchantos.com/oauth/access_token.php',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [
    // Fields can be referenced by their fieldDefinition key, and the
    // framework will fetch the missing values. Any values present in
    // this file override the references field's props.
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
  ],
};
