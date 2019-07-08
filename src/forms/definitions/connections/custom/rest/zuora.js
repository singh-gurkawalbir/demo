export default {
  preSubmit: formValues => ({
    ...formValues,
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
    '/type': 'rest',
    '/assistant': 'zuora',
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
      helpText: 'The API Key of your Certify account.',
    },
    {
      id: 'rest.encrypted.apiSecretAccessKey',
      required: true,
      type: 'text',
      label: 'Password:',
      inputType: 'password',
      helpText: 'The API Secret of your Certify account.',
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
      helpText:
        'Please select your environment here. Select Sandbox if the account is created on https://staging.integrator.io. Select Production if the account is created on https://integrator.io.',
      defaultValue: r => {
        const baseUri = r.rest.baseURI;

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
