export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'yammer',
    '/rest/authType': 'oauth',
    '/rest/oauth/useIClientFields': false,
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://www.yammer.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://www.yammer.com/oauth2/authorize',
    '/rest/oauthTokenURI': 'https://www.yammer.com/oauth2/access_token',
    '/rest/scopeDelimiter': ' ',
    '/rest/oauth/accessTokenPath': 'access_token.token',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    restAdvanced: { formId: 'restAdvanced' },
    application: {
      fieldId: 'application',
    },
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
