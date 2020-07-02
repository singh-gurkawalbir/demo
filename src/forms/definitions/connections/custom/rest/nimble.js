export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'nimble',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.nimble.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://api.nimble.com/oauth/authorize',
    '/rest/oauthTokenURI': 'https://api.nimble.com/oauth/token',
    '/rest/scopeDelimiter': ',',
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
      { collapsed: true, label: 'Advanced', fields: ['restAdvanced'] },
    ],
  },
};
