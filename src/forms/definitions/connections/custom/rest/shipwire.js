export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'shipwire',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/v3/orders',
      '/rest/baseURI': `https://api${
        formValues['/environment'] === 'sandbox' ? '.beta' : ''
      }.shipwire.com/api`,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'environment',
      name: '/environment',
      type: 'select',
      label: 'Account Type',
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
      id: 'Password',
      name: '/rest/basicAuth/password',
      type: 'text',
      inputType: 'password',
      label: 'Password:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
