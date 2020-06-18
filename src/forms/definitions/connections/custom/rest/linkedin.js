export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'linkedin',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.linkedin.com',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://www.linkedin.com/oauth/v2/authorization',
    '/rest/oauthTokenURI': 'https://www.linkedin.com/oauth/v2/accessToken',
    '/rest/scopeDelimiter': ' ',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.scope': {
      fieldId: 'rest.scope',
      scopes: [
        'r_basicprofile',
        'r_emailaddress',
        'rw_company_admin',
        'w_share',
      ],
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: ['name', 'rest.scope'],
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
