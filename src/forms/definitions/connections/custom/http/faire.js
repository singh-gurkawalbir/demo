export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'faire',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://www.${
      formValues['/http/accountType'] === 'staging' ? 'faire-stage' : 'cofaire'
    }.com`,
    '/http/ping/relativeURI': '/api/v1/orders',
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
          if (baseUri.indexOf('staging') === -1) {
            return 'staging';
          }
        }

        return 'production';
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
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
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
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
