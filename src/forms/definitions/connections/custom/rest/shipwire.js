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
      name: '/environment',
      type: 'select',
      label: 'Environment:',
      helpKey: 'shipwire.environment',
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
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'connection.rest.basicAuth.password',
      inputType: 'password',
      label: 'Password:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
