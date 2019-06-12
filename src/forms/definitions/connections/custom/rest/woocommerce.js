export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/wp-json/wc/v1/orders',
    '/type': 'rest',
    '/assistant': 'woocommerce',
    '/rest/pingMethod': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      helpText:
        'Please enter baseURI of your WooCommerce account. If your endpoint is  “https://shopName.com/wp-json/wc/v1/orders”, then use "https://shopName.com" as base URL.',
    },
    {
      fieldId: 'rest.basicAuth.username',
      label: 'Consumer Key:',
      helpText: 'The consumer key of your WooCommerce account.',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The consumer secret of your WooCommerce account.',
      label: 'Consumer Secret:',
    },
  ],
};
