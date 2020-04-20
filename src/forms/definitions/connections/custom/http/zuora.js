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
      helpKey: 'zuora.connection.http.unencrypted.apiAccessKeyId',
      label: 'Username',
    },
    'http.encrypted.apiSecretAccessKey': {
      id: 'http.encrypted.apiSecretAccessKey',
      required: true,
      type: 'text',
      label: 'Password',
      defaultValue: '',
      inputType: 'password',
      helpKey: 'zuora.connection.http.encrypted.apiSecretAccessKey',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.sandbox': {
      id: 'http.sandbox',
      type: 'select',
      helpKey: 'zuora.connection.http.sandbox',
      label: 'Account type',
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
      'http.sandbox',
      'http.unencrypted.apiAccessKeyId',
      'http.encrypted.apiSecretAccessKey',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
