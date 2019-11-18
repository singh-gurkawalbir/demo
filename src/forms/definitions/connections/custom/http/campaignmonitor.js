export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'campaignmonitor',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://api.createsend.com/api',
    '/http/token/location': 'header',
    '/http/auth/oauth/authURI': 'https://api.createsend.com/oauth',
    '/http/auth/oauth/tokenURI': 'https://api.createsend.com/oauth/token',
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'ViewReports',
        'ManageLists',
        'CreateCampaigns',
        'ImportSubscribers',
        'SendCampaigns',
        'ViewSubscribersInReports',
        'ManageTemplates',
        'AdministerPersons',
        'AdministerAccount',
        'ViewTransactional',
        'SendTransactional',
      ],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: ['name', 'http.auth.oauth.scope'],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
