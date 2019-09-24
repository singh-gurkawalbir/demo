export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'box',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.box.com',
    '/http/auth/token/location': 'header',
    '/http/auth/headerName': 'Authorization',
    '/http/auth/oauth/authURI': 'https://account.box.com/api/oauth2/authorize',
    '/http/auth/oauth/tokenURI': 'https://api.box.com/oauth2/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
