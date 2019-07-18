export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'avalara',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'v2/companies',
    '/rest/baseURI': `https://${
      formValues['/accType'] === 'sandbox' ? 'sandbox-' : ''
    }rest.avatax.com/api/`,
  }),

  fields: [
    { fieldId: 'name' },

    {
      id: 'accType',
      type: 'select',
      label: 'Account Type',
      required: true,
      helpText:
        'Please select your account type here. Select Production if your account URL starts with https://admin-avatax.avalara.net/. Select Sandbox if your account URL starts with https://admin-development.avalara.net/.',
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
          if (baseUri.indexOf('sandbox') === -1) {
            return 'production';
          }

          return 'sandbox';
        }

        return 'production';
      },
    },
    {
      fieldId: 'rest.basicAuth.username',
    },

    {
      fieldId: 'rest.basicAuth.password',
    },
  ],
};
