export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'shipstation',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'carriers',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://ssapi.shipstation.com`,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      label: 'API Key',
      helpText: 'The API Key of your ShipStation account.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpText:
        'The API Secret of your ShipStation account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API secret safe. This can be obtained from the Settings section and API secret subsection.',
      label: 'API Secret',
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
