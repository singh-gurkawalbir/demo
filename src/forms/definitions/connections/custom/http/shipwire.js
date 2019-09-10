export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shipwire',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v3/orders',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api${
      formValues['/environment'] === 'sandbox' ? '.beta' : ''
    }.shipwire.com/api`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'environment',
      type: 'select',
      label: 'Environment',
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
        const baseUri = r && r.http && r.http.baseURI;

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
      fieldId: 'http.auth.basic.username',
      helpText: 'The username of your Shipwire account.',
    },
    {
      fieldId: 'http.auth.basic.password',
      helpText: 'The password of your Shipwire account.',
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
