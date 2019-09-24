export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'squareup',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/ping/relativeURI': '/v2/locations',
    '/http/baseURI': `https://connect.squareup.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
    '/http/ping/successPath': 'locations',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'Access Token',
      required: true,
      helpText:
        'Enter your access token for Square here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe.',
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
