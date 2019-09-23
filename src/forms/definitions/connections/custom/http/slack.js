export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'slack',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': `https://slack.com/api`,
    '/http/ping/relativeURI': 'api.test',
    '/http/auth/token/location': 'url',
    '/http/auth/token/paramName': 'token',
    '/http/ping/successPath': 'ok',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
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
