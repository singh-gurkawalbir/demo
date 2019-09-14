export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'yahoo',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.login.yahoo.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://api.login.yahoo.com/oauth2/request_auth',
    '/rest/oauthTokenURI': 'https://api.login.yahoo.com/oauth2/get_token',
    '/rest/scopeDelimiter': ' ',
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
