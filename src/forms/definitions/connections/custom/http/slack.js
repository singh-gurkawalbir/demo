import { isJsonString } from '../../../../../utils/string';

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

    if (Object.hasOwnProperty.call(retValues, '/settings')) {
      let settings = retValues['/settings'];

      if (isJsonString(settings)) {
        settings = JSON.parse(settings);
      } else {
        settings = {};
      }

      retValues['/settings'] = settings;
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
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: [
        'admin',
        'calls:read',
        'calls:write',
        'channels:history',
        'channels:read',
        'channels:write',
        'chat:write:user',
        'commands',
        'dnd:read',
        'dnd:write',
        'emoji:read',
        'files:read',
        'files:write:user',
        'groups:history',
        'groups:read',
        'groups:write',
        'im:history',
        'im:write',
        'identify',
        'im:read',
        'incoming-webhook',
        'links:read',
        'links:write',
        'mpim:history',
        'mpim:read',
        'mpim:write',
        'reactions:read',
        'reactions:write',
        'pins:read',
        'pins:write',
        'reminders:read',
        'reminders:write',
        'remote_files:read',
        'remote_files:share',
        'remote_files:write',
        'search:read',
        'stars:read',
        'stars:write',
        'team:read',
        'usergroups:read',
        'usergroups:write',
        'users.profile:read',
        'users.profile:write',
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
    settings: { fieldId: 'settings' },
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
