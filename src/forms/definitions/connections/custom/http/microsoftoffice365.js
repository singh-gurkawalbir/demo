import uniq from 'lodash/uniq';

export default {
  preSave: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'microsoftoffice365',
    '/http/auth/type': 'oauth',
    '/http/mediaType': 'json',
    '/http/baseURI': 'https://graph.microsoft.com/v1.0',
    '/http/auth/oauth/authURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    '/http/auth/oauth/tokenURI':
      'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    '/http/auth/oauth/scope': uniq([
      ...['openid', 'offline_access'],
      ...formValues['/http/auth/oauth/scope'],
    ]),
    '/http/auth/oauth/scopeDelimiter': ' ',
    '/http/auth/token/refreshMethod': 'POST',
    '/http/auth/token/refreshMediaType': 'urlencoded',
  }),
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'openid',
        'offline_access',
        'contacts.read',
        'calendars.read',
        'calendars.readwrite',
        'contacts.readwrite',
        'directory.read.all',
        'directory.readwrite.all',
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
    application: {
      fieldId: 'application',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.oauth.scope'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
