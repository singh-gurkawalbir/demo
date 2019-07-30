export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zuora',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'v1/accounting-periods',
    '/rest/pingSuccessPath': 'success',
    '/rest/headers': [
      {
        name: 'apiAccessKeyId',
        value: '{{{connection.rest.encrypted.apiAccessKeyId}}}',
      },
      {
        name: 'apiSecretAccessKey',
        value: '{{{connection.rest.encrypted.apiSecretAccessKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
    '/rest/baseURI': `https://api${
      formValues['/rest/sandbox'] === 'sandbox' ? 'sandbox-api' : ''
    }.zuora.com/rest/`,
  }),

  fields: [
    { fieldId: 'name' },

    {
      id: 'rest.encrypted.apiAccessKeyId',
      required: true,
      type: 'text',
      label: 'Username:',
      inputType: 'password',
      helpText: 'Please enter Username of your Zuora account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'rest.encrypted.apiSecretAccessKey',
      required: true,
      type: 'text',
      label: 'Password:',
      inputType: 'password',
      helpText: 'Please enter Password of your Zuora account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'rest.sandbox',
      type: 'select',
      label: 'Account Type:',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Sandbox', value: 'sandbox' },
          ],
        },
      ],
      helpText: 'The Zuora account type.',
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('apisandbox') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
  ],
};
