export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'woocommerce',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/wp-json/wc/v1/orders',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      helpText:
        'Please enter baseURI of your WooCommerce account. If your endpoint is  “https://shopName.com/wp-json/wc/v1/orders”, then use "https://shopName.com" as base URL.',
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'Consumer Key',
      helpText: 'The consumer key of your WooCommerce account.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpText: 'The consumer secret of your WooCommerce account.',
      label: 'Consumer Secret',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.baseURI',
      'http.auth.basic.username',
      'http.auth.basic.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
