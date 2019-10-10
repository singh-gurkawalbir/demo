export default {
  preSave: formValues => ({
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
    }.zuora.com/rest/`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.apiAccessKeyId': {
      id: 'http.unencrypted.apiAccessKeyId',
      required: true,
      type: 'text',
      label: 'Username',
      helpText: 'Please enter Username of your Zuora account.',
    },
    'http.encrypted.apiSecretAccessKey': {
      id: 'http.encrypted.apiSecretAccessKey',
      required: true,
      type: 'text',
      label: 'Password',
      defaultValue: '',
      inputType: 'password',
      helpText:
        'Please enter Password of your Zuora account.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your password safe. This can be obtained from the Settings section and password subsection.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.sandbox': {
      id: 'http.sandbox',
      type: 'select',
      label: 'Account Type',
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
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.apiAccessKeyId',
      'http.encrypted.apiSecretAccessKey',
      'http.sandbox',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
