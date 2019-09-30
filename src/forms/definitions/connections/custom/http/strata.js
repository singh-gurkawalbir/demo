export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'strata',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.adazzle.com',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'Content-Type',
        value: 'application/json',
      },
      {
        name: 'Accept',
        value: 'application/json',
      },

      {
        name: 'Ocp-Apim-Subscription-Key',
        value: '{{{connection.http.encrypted.apiSecret}}}',
      },
      {
        name: 'Token',
        value: '{{{connection.http.auth.token.token}}}',
      },
    ],
    '/http/ping/relativeURI': '/FinancialBridgeMasterData/api/V4/vendors',
    '/http/auth/token/refreshRelativeURI':
      'https://api.adazzle.com/FinancialBridgeAuth/api/V4/app/logon',
    '/http/auth/token/refreshBody':
      '{ "applicationKey":"{{{connection.http.unencrypted.applicationKey}}}"}',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshTokenPath': 'token',
    '/http/auth/token/refreshMediaType': 'json',
    '/http/auth/token/refreshHeaders': [
      {
        name: 'Content-Type',
        value: 'application/json',
      },
      {
        name: 'Accept',
        value: 'application/json',
      },

      {
        name: 'ocp-apim-subscription-key',
        value: '{{{connection.http.encrypted.apiSecret}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.applicationKey': {
      id: 'http.unencrypted.applicationKey',
      required: true,
      type: 'text',
      label: 'Application Key',
      helpText: 'Please enter application key of your Strata account',
    },
    'http.encrypted.apiSecret': {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Ocp-Apim-Subscription-Key',
      helpText:
        'Please enter Ocp-Apim-Subscription-Key of your Strata account.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your private key safe.',
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        { field: 'http.unencrypted.applicationKey', is: [''] },
        { field: 'http.encrypted.apiSecret', is: [''] },
      ],
      label: 'Generate Token',
      defaultValue: '',
      helpText: 'The Access Token of your Strata account',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.applicationKey',
      'http.encrypted.apiSecret',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
