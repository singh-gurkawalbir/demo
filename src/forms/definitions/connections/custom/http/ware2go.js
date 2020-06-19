export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'ware2go',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://openapi${
      formValues['/http/accountType'] === 'staging'
        ? '.staging.ware2goproject.com'
        : '.ware2go.co'
    }/ware2go`,
    '/http/ping/relativeURI': `/v1/merchants/${
      formValues['/http/unencrypted/merchantId']
    }/inventory`,
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.accountType': {
      id: 'http.accountType',
      type: 'select',
      label: 'Account type',
      helpKey: 'ware2go.connection.http.accountType',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Staging', value: 'staging' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('staging') !== -1) {
            return 'staging';
          }
        }

        return 'production';
      },
    },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'Access token',
      helpKey: 'ware2go.connection.http.auth.basic.username',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpKey: 'ware2go.connection.http.auth.basic.password',
      label: 'Access secret',
    },
    'http.unencrypted.merchantId': {
      id: 'http.unencrypted.merchantId',
      helpKey: 'ware2go.connection.http.unencrypted.merchantId',
      label: 'Merchant id',
      required: true,
      type: 'text',
    },
    application: { id: 'application', type: 'text', label: 'Application', defaultValue: r => r && r.assistant ? r.assistant : r.type, defaultDisabled: true, },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.accountType',
          'http.auth.basic.username',
          'http.auth.basic.password',
          'http.unencrypted.merchantId'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
