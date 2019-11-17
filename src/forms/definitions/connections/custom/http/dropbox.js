export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'dropbox',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.dropboxapi.com',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI': `https://www.dropbox.com/1/oauth2/authorize`,
    '/http/auth/oauth/tokenURI': `https://api.dropboxapi.com/1/oauth2/token`,
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
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
