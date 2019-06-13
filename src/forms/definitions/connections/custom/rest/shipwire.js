export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'shipwire',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v3/orders',
    '/rest/baseURI': `https://api${
      formValues['/environment'] === 'sandbox' ? '.beta' : ''
    }.shipwire.com/api`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'environment',
      type: 'select',
      label: 'Environment:',
      helpText:
        'Please select your environment here. Select Sandbox if the account is created on https://beta.shipwire.com. Select Production if the account is created on https://www.shipwire.com.',
      required: true,
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('beta') === -1) {
            return 'production';
          }

          return 'sandbox';
        }

        return 'production';
      },
    },
    {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The username of your Shipwire account.',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The password of your Shipwire account.',
    },
  ],
};
