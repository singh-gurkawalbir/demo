import _ from 'lodash';

export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'microsoftoutlookmail',
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
        'Mail.Read',
        'Mail.ReadWrite',
        'Mail.Send',
        'MailboxSettings.Read',
        'MailboxSettings.ReadWrite',
      ],
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'restAdvanced' }],
    },
  ],
};
