export default {
  preSave: formValues => {
    const retValues = { ...formValues };
    const pingData = {
      client_id: '{{{clientId}}}',
      client_secret: '{{{clientSecret}}}',
      grant_type: 'refresh_token',
      refresh_token: '{{{connection.http.auth.token.refreshToken}}}',
      scope: 'read write read+write',
    };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/scheme'] = 'API-Key';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/oauth/grantType'] = undefined;
      retValues['/http/auth/oauth/clientCredentialsLocation'] = undefined;
      retValues['/http/auth/token/refreshMethod'] = undefined;
      retValues['/http/auth/token/refreshMediaType'] = undefined;
    } else {
      retValues['/http/auth/oauth/authURI'] = 'https://app.pandadoc.com/oauth2/authorize';
      retValues['/http/auth/oauth/tokenURI'] = 'https://api.pandadoc.com/oauth2/access_token';
      retValues['/http/auth/oauth/grantType'] = 'authorizecode';
      retValues['/http/auth/oauth/clientCredentialsLocation'] = 'body';
      retValues['/http/auth/oauth/scope'] = ['read write read+write'];
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/token/refreshRelativeURI'] =
  'https://api.pandadoc.com/oauth2/access_token';
      retValues['/http/auth/token/refreshBody'] = JSON.stringify(pingData);
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'pandadoc',
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://api.pandadoc.com/public/v1',
      '/http/ping/relativeURI': '/documents',
      '/http/ping/method': 'GET',
      '/http/auth/token/location': 'header',
      '/http/auth/token/headerName': 'Authorization',
      '/http/auth/oauth/useIClientFields': false,
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication type',
      isLoggable: true,
      helpKey: 'pandadoc.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Token', value: 'token' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      removeWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      id: 'http.auth.token.token',
      label: 'API key',
      required: true,
      helpKey: 'pandadoc.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
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
        fields: [
          'http.auth.type',
          'http._iClientId',
          'http.auth.oauth.callbackURL',
          'http.auth.token.token',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['httpAdvanced'],
      },
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
      label: 'Test',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
  ],
};
