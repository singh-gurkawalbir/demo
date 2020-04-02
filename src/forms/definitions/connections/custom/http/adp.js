export default {
  preSave: formValues => {
    const newValues = {
      ...formValues,
      '/type': 'http',
      '/assistant': 'adp',
      '/http/auth/type': 'token',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://${
        formValues['/accType'] === 'uat' ? 'uat-' : ''
      }api.adp.com`,
      '/http/ping/relativeURI': '/hr/v2/workers',
      '/http/ping/method': 'GET',
      '/http/auth/token/headerName': 'Authorization',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'json',
      '/http/auth/token/refreshRelativeURI': `https://${
        formValues['/accType'] === 'uat' ? 'uat-' : ''
      }accounts.adp.com/auth/oauth/v2/token?grant_type=client_credentials`,
      '/http/auth/token/refreshTokenPath': 'access_token',
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
    };

    if (formValues['/accType'] === 'production') {
      newValues['/http/auth/failStatusCode'] = 400;
      newValues['/http/auth/failPath'] = 'error_description';
      newValues['/http/auth/failValues'] = ['Validation error'];
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    accType: {
      id: 'accType',
      type: 'select',
      label: 'Account type',
      required: true,
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'UAT', value: 'uat' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('uat') !== -1) {
            return 'uat';
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
    'http.clientCertificates.cert': {
      fieldId: 'http.clientCertificates.cert',
      label: 'SSL certificate',
      type: 'uploadfile',
    },
    'http.clientCertificates.key': {
      fieldId: 'http.clientCertificates.key',
      label: 'SSL client key',
      type: 'uploadfile',
    },
    'http.clientCertificates.passphrase': {
      fieldId: 'http.clientCertificates.passphrase',
      label: 'SSL passphrase',
      type: 'textarea',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'accType',
      'http.unencrypted.clientId',
      'http.encrypted.clientSecret',
      'http.clientCertificates.cert',
      'http.clientCertificates.key',
      'http.clientCertificates.passphrase',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
