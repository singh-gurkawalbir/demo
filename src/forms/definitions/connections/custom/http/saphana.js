export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'saphana',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/sap/opu/odata/sap/API_SALES_ORDER_SRV',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${formValues['/http/baseurl']}-api.s4hana.ondemand.com`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseurl': {
      id: 'http.baseurl',
      startAdornment: 'https://',
      endAdornment: '-api.s4hana.ondemand.com',
      type: 'text',
      label: 'Base URL',
      helpKey: 'saphana.connection.http.baseurl',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;
        const baseurl =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('-api.s4hana.ondemand.com')
          );

        return baseurl;
      },
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
        fields: ['http.baseurl',
          'http.auth.basic.username',
          'http.auth.basic.password'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
