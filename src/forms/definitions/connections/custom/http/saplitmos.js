export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'saplitmos',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.litmos.com/v1.svc',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'apikey',
    '/http/auth/token/scheme': ' ',
    '/http/ping/relativeURI': '/users?source=staging.integrator.io',
    '/http/concurrencyLevel': `${formValues['/http/concurrencyLevel']}` || 1,
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API Key',
      required: true,
      helpText:
        'Please enter API Key of your SAP Litmos Account.Steps to generate API Key: Login to SAP Litmos Account -- > Click "My Profile & Settings" from the drop-down menu at the top right corner of the screen -- > View the bottom of your profile.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.token.token'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
