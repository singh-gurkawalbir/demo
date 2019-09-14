export default {
  preSubmit: formValues => ({
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
  fields: [
    { fieldId: 'name' },

    {
      fieldId: 'http.auth.token.token',
      label: 'Access Token',
      required: true,
      helpText:
        'Enter your access token for Square here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
