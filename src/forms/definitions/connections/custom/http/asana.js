export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'asana',
    '/http/auth/type': 'token',
    '/http/mediaType': 'urlencoded',
    '/http/ping/relativeURI': '/1.0/users',
    '/http/ping/method': 'GET',
    '/http/baseURI': 'https://app.asana.com/api',
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.token.token',
      required: true,
      label: 'Personal Access Token',
      helpText:
        'Enter your personal access token.\n\n Note: There are multiple layers of protection in place (including AES 256 encryption) to keep your API token safe.',
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
