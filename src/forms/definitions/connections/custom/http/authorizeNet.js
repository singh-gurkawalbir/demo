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
      id: 'authorizeNet.accType',
      type: 'select',
      label: 'Account Type:',
      helpText:
        'Please select your account type here. Select Sandbox if your API Endpoint starts with https://apitest.authorize.net. Select Production if your API Endpoint starts with https://api.authorize.net.',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

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
      id: 'http.encrypted.apiLoginID',
      type: 'text',
      label: 'API Login ID:',
      helpText:
        'Merchant’s unique API Login ID. The API Login ID is provided in the Merchant Interface and must be stored securely. The API Login ID and Transaction Key together provide the merchant authentication required for access to the payment gateway.',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered',
    },
    {
      id: 'http.encrypted.transactionKey',
      type: 'text',
      label: 'Transaction Key:',
      helpText:
        'Merchant’s unique Transaction Key. The merchant Transaction Key is provided in the Merchant Interface and must be stored securely. The API Login ID and Transaction Key together provide the merchant authentication required for access to the payment gateway.',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    { fieldId: 'http.disableStrictSSL' },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'http.concurrencyLevel' },
  ],
};
