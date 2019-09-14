export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'dropbox',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.dropboxapi.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': `https://www.dropbox.com/1/oauth2/authorize`,
    '/rest/oauthTokenURI': `https://api.dropboxapi.com/1/oauth2/token`,
    '/rest/rest/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
