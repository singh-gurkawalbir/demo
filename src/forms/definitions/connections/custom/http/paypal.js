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
      label: 'Account Type',
      options: [
        {
          items: [
            { label: 'Sandbox', value: 'sandbox' },
            { label: 'Production', value: 'production' },
          ],
        },
      ],
      helpText:
        'Please select your Account Type here. Select Sandbox if your API Endpoint starts with https://api.sandbox.paypal.com. Select Production if your API Endpoint starts with https://api.paypal.com',
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
      label: 'Client ID',
      helpText:
        'Please enter Client ID of your Paypal Account.Steps to generate API credentials: Login to Developer Account -- > My Apps & Credentials -- > Select the Sandbox or Live -- > Create an App -- > Copy the Client ID and Secret',
    },
    'http.encrypted.clientSecret': {
      id: 'http.encrypted.clientSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Client Secret',
      inputType: 'password',
      helpText:
        'Please enter Client Secret of your Paypal Account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.Steps to generate API credentials: Login to Developer Account -- > My Apps & Credentials -- > Select the Sandbox or Live -- > Create an App -- > Copy the Client ID and Secret',
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
      label: 'Generate Token',
      defaultValue: '',
      helpText: 'The access token of your Paypal account.',
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
