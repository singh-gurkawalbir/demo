export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'mailgun',
    '/http/auth/type': 'basic',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/domains',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.mailgun.net/v3`,
    '/http/auth/basic/username': 'api',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.basic.password': {
      fieldId: 'http.auth.basic.password',
      label: 'API Key',
      helpKey: 'mailgun.connection.http.auth.basic.password',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.basic.password'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
