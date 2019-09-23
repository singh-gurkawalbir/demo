export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'oandav20fxtrade',
    '/http/auth/type': 'token',
    '/http/ping/method': 'GET',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api-${
      formValues['/accountType'] === 'trading' ? 'fxtrade' : 'fxpractice'
    }.oanda.com`,
    '/http/ping/relativeURI': '/v3/accounts',
    '/http/headers': [{ name: 'Content-Type', value: 'application/json' }],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    accountType: {
      id: 'accountType',
      type: 'select',
      label: 'Account Type:',
      options: [
        {
          items: [
            { label: 'Demo', value: 'demo' },
            { label: 'Trading', value: 'trading' },
          ],
        },
      ],
      helpText:
        'Please select your account type here. Select Demo if your account type is "fxTrade Practice". Select Trading if your account type is "fxTrade".',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('fxpractice.') !== -1) {
            return 'demo';
          }
        }

        return 'trading';
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      helpText: 'Please enter your API token here.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'accountType', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
