export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'faire',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://www.${
      formValues['/http/accountType'] === 'staging' ? 'faire-stage' : 'faire'
    }.com`,
    '/http/ping/relativeURI': '/external-api/v2/orders',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'X-FAIRE-ACCESS-TOKEN',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      {
        name: 'User-Agent',
        value: 'navigator.userAgent',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.accountType': {
      id: 'http.accountType',
      type: 'select',
      label: 'Account type',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Staging', value: 'staging' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('faire-stage') !== -1) {
            return 'staging';
          }

          return 'production';
        }
      },
      helpKey: 'faire.connection.http.accountType',
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      label: 'API access token',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'faire.connection.http.encrypted.apiKey',
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.accountType', 'http.encrypted.apiKey'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
