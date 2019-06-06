export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'v2/companies',
    '/type': 'rest',
    '/assistant': 'avalara',
    '/rest/baseURI': `https://${
      formValues['/accType'] === 'sandbox' ? 'sandbox-' : ''
    }rest.avatax.com/api/`,
  }),

  fields: [
    { fieldId: 'name' },

    {
      name: '/accType',
      type: 'select',
      label: 'Account Type',
      required: true,
      helpKey: 'avalara.accType',
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
      helpKey: 'avalara.username',
    },

    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'avalara.password',
      inputType: 'password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
