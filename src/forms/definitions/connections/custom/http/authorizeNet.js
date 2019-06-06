export default {
  preSubmit: formValues => {
    const pingBody = {
      authenticateTestRequest: {
        merchantAuthentication: {
          name: `${formValues['/http/encrypted/apiLoginID']}`,
          transactionKey: `${formValues['/http/encrypted/transactionKey']}`,
        },
      },
    };

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'authorize.net',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://${
        formValues['/authorizeNet/accType'] === 'sandbox' ? 'apitest' : 'api'
      }.authorize.net`,
      '/http/ping/relativeURI': '/xml/v1/request.api',
      '/http/ping/successPath': 'messages.resultCode',
      '/http/ping/successValues': ['Ok'],
      '/http/ping/body': JSON.stringify(pingBody),
      '/http/ping/method': 'POST',
    };
  },
  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'authorizeNet.accType',
      defaultValue: r => {
        const baseUri = r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('apitest') === -1) {
            return 'production';
          }

          return 'sandbox';
        }

        return '';
      },
    },
    {
      fieldId: 'http.encrypted.apiLoginID',
    },
    {
      fieldId: 'http.encrypted.transactionKey',
    },
  ],
};
