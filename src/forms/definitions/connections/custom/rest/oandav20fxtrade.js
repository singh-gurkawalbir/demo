export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({ name: 'Content-Type', value: 'application/json' });

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'oandav20fxtrade',
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://api-${
        formValues['/accountType'] === 'trading' ? 'fxtrade' : 'fxpractice'
      }.oanda.com`,
      '/rest/pingRelativeURI': '/v3/accounts',
      '/rest/headers': headers,
    };
  },
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
        'Please select your environment here. Select Sandbox if the account is created on https://staging.integrator.io. Select Production if the account is created on https://integrator.io.',
      defaultValue: r => {
        const baseUri = r.rest.baseURI;

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
      label: 'Token:',
      required: true,
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
