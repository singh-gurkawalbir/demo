export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'aptrinsic',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/users',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.aptrinsic.com/',
    '/http/headers': [
      {
        name: 'X-APTRINSIC-API-KEY',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
    ],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key',
      inputType: 'password',
      defaultValue: '',
      helpKey: 'aptrinsic.connection.http.encrypted.apiKey',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.encrypted.apiKey'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
