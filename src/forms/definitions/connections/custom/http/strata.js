export default {
  preSubmit: formValues => ({
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
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.unencrypted.applicationKey',
      required: true,
      type: 'text',
      label: 'Application Key:',
      helpText: 'Please enter application key of your Strata account',
    },
    {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'Ocp-Apim-Subscription-Key',
      helpText: 'Please enter Ocp-Apim-Subscription-Key of your Strata account',
    },
    {
      id: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'http.unencrypted.applicationKey',
          is: [''],
        },
        {
          field: 'http.encrypted.apiSecret',
          is: [''],
        },
      ],
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The Access Token of your Strata account',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
