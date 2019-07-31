import _ from 'lodash';

export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'microsoftonenote',
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://graph.microsoft.com/v1.0`,
    '/rest/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/rest/oauthTokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
    '/rest/scope': _.merge(
      ['openid', 'offline_access'],
      formValues['/rest/scope']
    ),
    '/rest/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      scopes: [
        'openid',
        'offline_access',
        'Calendars.ReadWrite',
        'Calendars.Read',
        'MailboxSettings.Read',
        'MailboxSettings.ReadWrite',
      ],
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
