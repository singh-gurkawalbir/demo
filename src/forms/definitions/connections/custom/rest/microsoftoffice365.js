import _ from 'lodash';

export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'oauth',
    '/rest/mediaType': 'json',
    '/type': 'rest',
    '/assistant': 'microsoftoffice365',
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
      scope: [
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
};
