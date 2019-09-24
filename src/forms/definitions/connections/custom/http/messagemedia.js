export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'messagemedia',
    '/http/auth/type': 'basic',
    '/http/baseURI': 'https://api.messagemedia.com',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/replies',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      helpText:
        'Please enter your API User. Navigate to Merchant view on left hand side and click on API keys section to find API User.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API Secret',
      helpText:
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. Navigate to Merchant view on left hand side and click on API keys section to find API Key.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.basic.username', 'http.auth.basic.password'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
