export default {
  preSave: formValues => {
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
  fieldMap: {
    name: {
      fieldId: 'name',
    },
    'authorizeNet.accType': {
      id: 'authorizeNet.accType',
      type: 'select',
      label: 'Account type',
      options: [
        {
          items: [
            {
              label: 'Production',
              value: 'production',
            },
            {
              label: 'Sandbox',
              value: 'sandbox',
            },
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
    'http.encrypted.apiLoginID': {
      id: 'http.encrypted.apiLoginID',
      type: 'text',
      label: 'API login id',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered',
    },
    'http.encrypted.transactionKey': {
      id: 'http.encrypted.transactionKey',
      type: 'text',
      label: 'Transaction key',
      required: true,
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: {
      formId: 'httpAdvanced',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['authorizeNet.accType',
          'http.encrypted.apiLoginID',
          'http.encrypted.transactionKey'] },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['httpAdvanced'],
      },
    ],
  },
};
