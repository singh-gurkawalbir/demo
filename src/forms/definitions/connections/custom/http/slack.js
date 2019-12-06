export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'url';
      retValues['/http/auth/token/paramName'] = 'token';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
    } else {
      retValues['/http/auth/oauth/authURI'] =
        'https://slack.com/oauth/authorize';
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] =
        'https://slack.com/api/oauth.access';
      retValues['/http/auth/oauth/scopeDelimiter'] = ',';
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'slack',
      '/http/mediaType': 'urlencoded',
      '/http/baseURI': `https://slack.com/api`,
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
      label: 'Authentication Type',
      helpText: 'Please select Authentication Type',
      options: [
        {
          items: [
            { label: 'Token', value: 'token' },
            { label: 'OAuth', value: 'oauth' },
          ],
        },
      ],
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'admin',
        'admin.conversations:read',
        'admin.invites:read',
        'admin.invites:write',
        'admin.teams:read',
        'admin.teams:write',
        'admin.users:read',
        'admin.users:write',
        'app_mentions:read',
        'apps',
        'auditlogs:read',
        'bot',
        'calls:read',
        'calls:write',
        'channels:history',
        'channels:join',
        'channels:manage',
        'channels:read',
        'channels:write',
        'chat:write',
        'chat:write:bot',
        'chat:write:user',
        'client',
        'commands',
        'conversations:history',
        'conversations:read',
        'conversations:write',
        'discovery:read',
        'discovery:write',
        'dnd:read',
        'dnd:write',
        'dnd:write:user',
        'emails:write',
        'emoji:read',
        'files:read',
        'files:write',
        'files:write:user',
        'groups:history',
        'groups:read',
        'groups:write',
        'identify',
        'identity.avatar',
        'identity.avatar:read:user',
        'identity.basic',
        'identity.email',
        'identity.email:read:user',
        'identity.team',
        'identity.team:read:user',
        'identity:read:user',
        'ifttt',
        'im:history',
        'im:read',
        'im:write',
        'incoming-webhook',
        'links:read',
        'links:write',
        'mpim:history',
        'mpim:read',
        'mpim:write',
        'none',
        'pins:read',
        'pins:write',
        'post',
        'reactions:read',
        'reactions:write',
        'read',
        'reminders:read',
        'reminders:read:user',
        'reminders:write',
        'reminders:write:user',
        'remote_files:read',
        'remote_files:share',
        'remote_files:write',
        'rtm:stream',
        'search:read',
        'stars:read',
        'stars:write',
        'team:read',
        'tokens.basic',
        'usergroups:read',
        'usergroups:write',
        'users.profile:read',
        'users.profile:write',
        'users.profile:write:user',
        'users:read',
        'users:read.email',
        'users:write',
      ],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.auth.type',
      'http.auth.oauth.scope',
      'http.auth.token.token',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
    {
      id: 'cancel',
    },
    {
      id: 'oauth',
      label: 'Save & Authorize',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'test',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
    {
      id: 'save',
      label: 'Save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
  ],
};
