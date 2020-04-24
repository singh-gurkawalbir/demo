export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'inspectorio',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://sight${
      formValues['/environment'] === 'sandbox' ? '-pre' : ''
    }.inspectorio.com`,
    '/http/ping/relativeURI': '/api/v1/brands',
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'apiKey',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    environment: {
      id: 'environment',
      type: 'select',
      label: 'Environment',
      helpKey: 'inspectorio.connection.enviornment',
      options: [
        {
          items: [
            { label: 'Production', value: 'production' },
            { label: 'Pre-Production', value: 'sandbox' },
          ],
        },
      ],
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox.') !== -1) {
            return 'sandbox';
          }
        }

        return 'production';
      },
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'inspectorio.connection.http.encrypted.apiKey',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'environment', 'http.encrypted.apiKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
