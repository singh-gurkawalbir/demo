import _ from 'lodash';

export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftoffice365',
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
        'contacts.read',
        'calendars.read',
        'calendars.readwrite',
        'contacts.readwrite',
        'device.readwrite.all',
        'directory.read.all',
        'directory.readwrite.all',
        'domain.readwrite.all',
        'eduadministration.read.all',
        'eduadministration.readwrite.all',
        'identityriskevent.read.all',
        'mail.read',
        'mail.readwrite',
        'mail.send',
        'mailboxsettings.read',
        'mailboxsettings.readwrite',
        'member.read.hidden',
        'notes.read.all',
        'notes.readwrite.all',
        'people.read.all',
        'reports.read.all',
        'securityevents.read.all',
        'securityevents.readwrite.all',
        'sites.fullcontrol.all',
        'sites.manage.all',
        'sites.read.all',
        'sites.readwrite.all',
        'user.invite.all',
        'user.read.all',
        'user.readwrite.all',
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
