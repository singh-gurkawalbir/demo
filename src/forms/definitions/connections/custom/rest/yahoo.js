export default {
  preSave: formValues => ({
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
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
