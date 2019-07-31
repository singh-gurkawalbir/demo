export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'oandav20fxtrade',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api-${
      formValues['/accountType'] === 'trading' ? 'fxtrade' : 'fxpractice'
    }.oanda.com`,
    '/rest/pingRelativeURI': '/v3/accounts',
    '/rest/headers': [{ name: 'Content-Type', value: 'application/json' }],
  }),
  fields: [
    { fieldId: 'name' },
    {
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
        const baseUri = r && r.rest && r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('fxpractice.') !== -1) {
            return 'demo';
          }
        }

        return 'trading';
      },
    },
    {
      fieldId: 'rest.bearerToken',
      required: true,
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
