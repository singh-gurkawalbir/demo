export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'anaplan',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '1/3/workspaces',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://api.anaplan.com/',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.username': {
      fieldId: 'http.auth.basic.username',
      helpText: 'The username of your Anaplan account.',
    },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      helpText: 'The password of your Anaplan account.',
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
