export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'paypal',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api${
      formValues['/http/accountType'] === 'sandbox' ? '.sandbox' : ''
    }.paypal.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/scheme': 'Bearer',
    '/http/auth/token/headerName': 'Authorization',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/v1/catalogs/products',
    '/http/auth/token/refreshRelativeURI': `https://api${
      formValues['/http/accountType'] === 'sandbox' ? '.sandbox' : ''
    }.paypal.com/v1/oauth2/token`,
    '/http/auth/token/refreshBody': '{"grant_type":"client_credentials"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
    '/http/auth/token/refreshHeaders': [
      {
        name: 'Authorization',
        value: `Basic ${window.btoa(
          `${formValues['/http/unencrypted/clientId']}:${
            formValues['/http/encrypted/clientSecret']
          }`
        )}`,
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.accountType': {
      id: 'http.accountType',
      type: 'select',
      required: true,
      label: 'Account type',
      options: [
        {
          items: [
            { label: 'Sandbox', value: 'sandbox' },
            { label: 'Production', value: 'production' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.unencrypted.clientId': {
      id: 'http.unencrypted.clientId',
      required: true,
      type: 'text',
      label: 'Client id',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Client secret',
      inputType: 'password',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.clientId', is: [''] },
        { field: 'http.encrypted.clientSecret', is: [''] },
      ],
      label: 'Generate token',
      defaultValue: '',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.accountType',
      'http.unencrypted.clientId',
      'http.encrypted.clientSecret',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
