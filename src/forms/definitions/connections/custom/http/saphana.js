export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'saphana',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/sap/opu/odata/sap/API_SALES_ORDER_SRV',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/http/unencrypted/host']}`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.host': {
      id: 'http.unencrypted.host',
      startAdornment: 'https://',
      type: 'text',
      label: 'Host',
      helpKey: 'saphana.connection.http.unencrypted.host',
      required: true,
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'Username',
      helpKey: 'saphana.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'Password',
      helpKey: 'saphana.connection.http.auth.basic.password',
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
        fields: ['http.unencrypted.host',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
