export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'campaignmonitor',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': 'https://api.createsend.com/api',
    '/rest/tokenLocation': 'header',
    '/rest/authURI': 'https://api.createsend.com/oauth',
    '/rest/oauthTokenURI': 'https://api.createsend.com/oauth/token',
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
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
  ],
};
