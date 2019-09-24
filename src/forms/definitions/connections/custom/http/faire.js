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
      label: 'Account Type',
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
      helpText: 'Please select your environment here.',
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      label: 'API Access Token',
      required: true,
      type: 'text',
      inputType: 'password',
      defaultValue: '',
      helpText:
        'Please Enter the access token got from Faire support. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API Access token safe. This can be obtained from the Settings section and API Access token subsection.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.accountType', 'http.encrypted.apiKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
