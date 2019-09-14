export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'woocommerce',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/wp-json/wc/v1/orders',
    '/rest/pingMethod': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.baseURI': {
      fieldId: 'rest.baseURI',
      helpText:
        'Please enter baseURI of your WooCommerce account. If your endpoint is  “https://shopName.com/wp-json/wc/v1/orders”, then use "https://shopName.com" as base URL.',
    },
    'rest.basicAuth.username': {
      fieldId: 'rest.basicAuth.username',
      label: 'Consumer Key:',
      helpText: 'The consumer key of your WooCommerce account.',
    },
    'rest.basicAuth.password': {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The consumer secret of your WooCommerce account.',
      label: 'Consumer Secret:',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.baseURI',
      'rest.basicAuth.username',
      'rest.basicAuth.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
