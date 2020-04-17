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
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'Access secret',
    },
    'http.unencrypted.merchantId': {
      id: 'http.unencrypted.merchantId',
      label: 'Merchant id',
      required: true,
      type: 'text',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.accountType',
      'http.auth.basic.username',
      'http.auth.basic.password',
      'http.unencrypted.merchantId',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
