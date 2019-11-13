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
      label: 'Account Type',
      required: true,
      helpText:
        'Please select your account type here. Select UAT if your API Endpoint starts with https://uat-api.adp.com. Select Production if your API Endpoint starts with https://api.adp.com.',
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
      label: 'Client ID',
      helpText: 'Please enter the Client ID provided by ADP support service.',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Client Secret',
      inputType: 'password',
      helpText:
        'Please enter the Client Secret provided by ADP support service. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
    },
    'http.clientCertificates.cert': {
      fieldId: 'http.clientCertificates.cert',
      label: 'SSL Certificate',
      type: 'uploadfile',
      helpText:
        '1. Install OpenSSL Light and configure the OpenSSL by adding an environmental variable after this we have to open the openssl.cfg file which is located in the C drive and remove the ìunstructuredName = An optional company nameî present in ì[req_attributes ]î area.2.After installation, we have to generate a CSR file (Certificate Signing Request) file using command prompt and execute the below commands. Replace yourcompanynamehere with an actual company name. Command to generate the CSR file: Openssl req -new -key yourcompanynamehere_auth.key -out yourcompanynamehere_auth.csr3.Email the .csr file that was generated to ADP Representative and we have to wait for the certificate Signing and the ADP Representative will mail us .pem file.',
    },
    'http.clientCertificates.key': {
      fieldId: 'http.clientCertificates.key',
      label: 'SSL Client Key',
      type: 'uploadfile',
      helpText:
        '1. Install OpenSSL Light and configure the OpenSSL by adding an environmental variable after this we have to open the openssl.cfg file which is located in the C drive and remove the ìunstructuredName = An optional company nameî present in ì[req_attributes ]î area.2.After installation we have to generate a CSR file (Certificate Signing Request) file using command prompt and execute the below commands. Replace yourcompanynamehere with an actual company name.Command to generate the .Key file: openssl genrsa -out yourcompanynamehere_auth.key 2048.',
    },
    'http.clientCertificates.passphrase': {
      fieldId: 'http.clientCertificates.passphrase',
      label: 'SSL Passphrase',
      type: 'textarea',
      helpText:
        'If there is any password for PFX file then it should be given here.',
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
