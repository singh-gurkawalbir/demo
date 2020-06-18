export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'steelbrick',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://login.salesforce.com',
    '/http/auth/token/location': 'header',
    '/http/auth/oauth/authURI':
      'https://login.salesforce.com/services/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.salesforce.com/services/oauth2/token',
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
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.partnerUserId',
          'http.encrypted.partnerUserSecret'] },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
