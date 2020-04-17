export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'newegg',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.newegg.com/marketplace${
      formValues['/accountType'] === 'neweggbusiness' ? '/b2b' : ''
    }`,
    '/http/ping/relativeURI': `/sellermgmt/seller/industry?sellerid=${
      formValues['/http/unencrypted/sellerId']
    }`,
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'Authorization',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      {
        name: 'Secretkey',
        value: '{{{connection.http.encrypted.apiSecret}}}',
      },
      {
        name: 'Content-Type',
        value: 'application/json',
      },
      { name: 'Accept', value: 'application/json' },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    accountType: {
      id: 'accountType',
      type: 'select',
      label: 'Account type',
      options: [
        {
          items: [
            { label: 'Newegg', value: 'newegg' },
            { label: 'Newegg Business', value: 'neweggbusiness' },
          ],
        },
      ],
      helpKey: 'newegg.connection.accountType',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('b2b') !== -1) {
            return 'neweggbusiness';
          }
        }

        return 'newegg';
      },
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      type: 'text',
      label: 'API key',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpKey: 'newegg.connection.http.encrypted.apiKey',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.apiSecret': {
      id: 'http.encrypted.apiSecret',
      type: 'text',
      label: 'API secret',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpKey: 'newegg.connection.http.encrypted.apiSecret',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.unencrypted.sellerId': {
      id: 'http.unencrypted.sellerId',
      type: 'text',
      label: 'Seller ID',
      required: true,
      helpKey: 'newegg.connection.http.unencrypted.sellerId',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'accountType',
      'http.encrypted.apiKey',
      'http.encrypted.apiSecret',
      'http.unencrypted.sellerId',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
