export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'quip',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/baseURI': `https://platform.quip.com`,
    '/http/ping/relativeURI': '/1/threads/recent',
    '/http/ping/method': 'GET',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      label: 'API Access Token',
      required: true,
      helpText:
        'Please enter your API token here.Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API Access token safe. This can be obtained from the Settings section and API Access token subsection.',
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
