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
        value: '{{{connection.http.encrypted.subscriptionKey}}}',
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
        value: '{{{connection.http.encrypted.subscriptionKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.applicationKey': {
      id: 'http.unencrypted.applicationKey',
      required: true,
      type: 'text',
      label: 'Application key',
    },
    'http.encrypted.subscriptionKey': {
      id: 'http.encrypted.subscriptionKey',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      label: 'Ocp-Apim-Subscription-Key',
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
      label: 'Generate token',
      required: true,
      defaultValue: '',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.encrypted.subscriptionKey',
      'http.unencrypted.applicationKey',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
