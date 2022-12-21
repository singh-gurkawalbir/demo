import { isJsonString } from '../../../../../utils/string';

export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
    } else {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/oauth/authURI'] =
        `https://slack.com/oauth/v2/authorize?user_scope=${formValues['/http/unencrypted/userScopes']}`;
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] =
        'https://slack.com/api/oauth.v2.access';
      retValues['/http/auth/oauth/scopeDelimiter'] = ',';
    }

    if (Object.hasOwnProperty.call(retValues, '/settings')) {
      let settings = retValues['/settings'];

      if (isJsonString(settings)) {
        settings = JSON.parse(settings);
      } else {
        settings = {};
      }

      retValues['/settings'] = settings;
    }

    const userScopes = ['admin', 'channels:write', 'dnd:write', 'identify', 'search:read', 'stars:read', 'stars:write', 'users.profile:write', 'reminders:read', 'reminders:write', 'chat:write', 'files:write', 'files:read'];
    let isUserScopeSelected = false;

    userScopes.forEach(userScope => {
      if (retValues['/http/unencrypted/userScopes'].includes(userScope)) {
        isUserScopeSelected = true;
      }
    });
    if (isUserScopeSelected) {
      retValues['/http/auth/oauth/accessTokenPath'] = 'authed_user.access_token';
    } else {
      retValues['/http/auth/oauth/accessTokenPath'] = 'access_token';
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'slack',
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://slack.com/api',
      '/http/ping/relativeURI': 'api.test',
      '/http/ping/method': 'GET',
      '/http/ping/successPath': 'ok',
    };
  },

  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      helpKey: 'slack.connection.http.auth.type',
      label: 'Authentication Type',
      options: [
        {
          items: [
            { label: 'Token', value: 'token' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      required: true,
      scopes: [
        'calls:read',
        'calls:write',
        'channels:history',
        'channels:read',
        'commands',
        'dnd:read',
        'emoji:read',
        'groups:history',
        'groups:read',
        'groups:write',
        'im:history',
        'im:read',
        'im:write',
        'incoming-webhook',
        'links:read',
        'links:write',
        'mpim:history',
        'mpim:read',
        'mpim:write',
        'pins:read',
        'pins:write',
        'reactions:read',
        'reactions:write',
        'remote_files:read',
        'remote_files:share',
        'team.billing:read',
        'team.preferences:read',
        'team:read',
        'usergroups:read',
        'usergroups:write',
        'users.profile:read',
        'users:read',
        'users:read.email',
        'users:write',
      ],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.unencrypted.userScopes': {
      fieldId: 'http.unencrypted.userScopes',
      label: 'User scope',
      type: 'multiselect',
      helpKey: 'slack.connection.http.unencrypted.userScopes',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      options: [
        {
          items: [
            { label: 'admin', value: 'admin' },
            { label: 'channels:write', value: 'channels:write' },
            { label: 'chat:write', value: 'chat:write' },
            { label: 'dnd:write', value: 'dnd:write' },
            { label: 'files:read', value: 'files:read' },
            { label: 'files:write', value: 'files:write' },
            { label: 'identify', value: 'identify' },
            { label: 'reminders:read', value: 'reminders:read' },
            { label: 'reminders:write', value: 'reminders:write' },
            { label: 'search:read', value: 'search:read' },
            { label: 'stars:read', value: 'stars:read' },
            { label: 'stars:write', value: 'stars:write' },
            { label: 'users.profile:write', value: 'users.profile:write' },
          ],
        },
      ],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
      helpKey: 'slack.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    settings: { fieldId: 'settings' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.auth.type',
          'http.auth.oauth.scope',
          'http.unencrypted.userScopes',
          'http.auth.token.token'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'oauthandcancel',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'saveandclosegroup',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
    },

    {
      id: 'testandsavegroup',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
  ],
};
