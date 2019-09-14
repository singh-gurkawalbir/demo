export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'drift',
    '/http/auth/type': 'token',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/accounts',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://driftapi.com`,
    '/http/auth/token/location': 'header',
    '/http/auth/token/headerName': 'Authorization',
    '/http/auth/token/scheme': 'Bearer',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.token.token',
      label: 'Personal Access Token',
      helpText:
        'Please enter your access token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your access token safe. This token is automatically generated when you installed the app to your team. You can use this to authenticate your app.',
      required: true,
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
