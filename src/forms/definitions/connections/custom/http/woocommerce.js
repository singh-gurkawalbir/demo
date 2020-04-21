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
      helpKey: 'woocommerce.connection.http.baseURI',
      required: true,
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpKey: 'woocommerce.connection.http.auth.basic.username',
      label: 'Consumer key',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'woocommerce.connection.http.auth.basic.password',
      label: 'Consumer secret',
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
