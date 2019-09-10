import _ from 'lodash';

export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftoutlookmail',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://graph.microsoft.com/v1.0`,
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/token',
    '/http/auth/oauth/scope': _.merge(
      ['openid', 'offline_access'],
      formValues['/http/auth/oauth/scope']
    ),
    '/http/auth/oauth/scopeDelimiter': ' ',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'http.auth.oauth.scope',
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
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
