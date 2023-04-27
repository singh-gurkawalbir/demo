export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'oauth') {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/oauth/authURI'] = 'https://app.pagerduty.com/oauth/authorize';
      retValues['/http/auth/oauth/tokenURI'] = 'https://app.pagerduty.com/oauth/token';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/oauth/grantType'] = 'authorizecode';
      retValues['/http/auth/oauth/clientCredentialsLocation'] = 'body';
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
    } else {
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/token/scheme'] = 'Token token=';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/oauth/grantType'] = undefined;
      retValues['/http/auth/oauth/clientCredentialsLocation'] = undefined;
      retValues['/http/auth/token/refreshMethod'] = undefined;
      retValues['/http/auth/token/refreshMediaType'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'pagerduty',
      '/http/mediaType': 'json',
      '/http/baseURI': 'https://api.pagerduty.com',
      '/http/ping/relativeURI': '/users',
      '/http/ping/method': 'GET',
      '/http/headers': [
        {
          name: 'Accept',
          value: 'application/vnd.pagerduty+json;version=2',
        },
      ],
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      fieldId: 'http.auth.type',
      type: 'select',
      label: 'Authentication type',
      isLoggable: true,
      helpKey: 'pagerduty.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'OAuth 2.0', value: 'oauth' },
            { label: 'Token', value: 'token' },
          ],
        },
      ],
      defaultValue: r => {
        const authType = r && r.http && r.http.auth && r.http.auth.type;

        if (authType === 'oauth') {
          return 'oauth';
        }

        return 'token';
      },
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      defaultValue: '',
      label: 'API key',
      required: true,
      helpKey: 'pagerduty.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
      removeWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      helpKey: 'pagerduty.connection.http._iClientId',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      removeWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
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
        fields: ['http.auth.type',
          'http.auth.token.token',
          'http._iClientId',
          'http.auth.oauth.callbackURL',
        ] },
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
