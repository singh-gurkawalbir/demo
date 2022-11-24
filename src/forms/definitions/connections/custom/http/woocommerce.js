export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'woocommerce',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/wp-json/wc/v1/orders',
    '/http/ping/method': 'GET',
    '/http/headers': [{ name: 'User-Agent', value: 'PostmanRuntime/7.29.2' }],
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
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.baseURI',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
