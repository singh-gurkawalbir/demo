export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'splunk',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/',
    '/http/ping/method': 'GET',
    '/http/disableStrictSSL': true,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.baseURI': { fieldId: 'http.baseURI', required: true },
    'http.auth.basic.username': { fieldId: 'http.auth.basic.username' },
    'http.auth.basic.password': { fieldId: 'http.auth.basic.password' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.baseURI',
      'http.auth.basic.username',
      'http.auth.basic.password',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
