export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'cartrover',
    '/http/auth/type': 'basic',
    '/http/baseURI': 'https://api.cartrover.com/',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/merchant/inventory',
    '/http/ping/method': 'GET',
    '/http/ping/successPath': 'success_code',
    '/http/ping/successValues': ['true'],
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API User',
      helpText:
        'Please enter your API User. Navigate to Merchant view on left hand side and click on API keys section to find API User.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API Key',
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
