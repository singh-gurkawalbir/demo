export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'woocommerce',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/wp-json/wc/v1/orders',
    '/http/ping/method': 'GET',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.baseURI',
      helpText:
        'Please enter baseURI of your WooCommerce account. If your endpoint is  “https://shopName.com/wp-json/wc/v1/orders”, then use "https://shopName.com" as base URL.',
    },
    {
      fieldId: 'http.auth.basic.username',
      label: 'Consumer Key',
      helpText: 'The consumer key of your WooCommerce account.',
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText: 'The consumer secret of your WooCommerce account.',
      label: 'Consumer Secret',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
