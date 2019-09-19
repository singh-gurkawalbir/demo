export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'zuora',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'v1/accounting-periods',
    '/http/ping/method': 'GET',
    '/http/ping/successPath': 'success',
    '/http/headers': [
      {
        name: 'apiAccessKeyId',
        value: '{{{connection.http.unencrypted.apiAccessKeyId}}}',
      },
      {
        name: 'apiSecretAccessKey',
        value: '{{{connection.http.encrypted.apiSecretAccessKey}}}',
      },
      { name: 'Content-Type', value: 'application/json' },
    ],
    '/http/baseURI': `https://api${
      formValues['/http/sandbox'] === 'sandbox' ? 'sandbox-api' : ''
    }.zuora.com/http/`,
  }),

  fields: [
    { fieldId: 'name' },
    {
      id: 'http.unencrypted.apiAccessKeyId',
      required: true,
      type: 'text',
      label: 'Username',
      helpText: 'Please enter Username of your Zuora account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'http.encrypted.apiSecretAccessKey',
      required: true,
      type: 'text',
      label: 'Password',
      defaultValue: '',
      inputType: 'password',
      helpText: 'Please enter Password of your Zuora account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'http.sandbox',
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
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('apisandbox') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
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
