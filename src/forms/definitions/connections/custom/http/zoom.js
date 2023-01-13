export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'oauth') {
      retValues['/http/auth/oauth/authURI'] =
        'https://zoom.us/oauth/authorize';
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/oauth/tokenURI'] =
        'https://zoom.us/oauth/token';
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/token/scheme'] = 'Bearer';
    } else {
      retValues['/http/auth/token/token'] = undefined;
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/oauth/scopeDelimiter'] = undefined;
      retValues['/http/auth/oauth/scope'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'zoom',
      '/http/mediaType': 'json',
      '/http/ping/relativeURI': '/v2/users',
      '/http/ping/method': 'GET',
      '/http/baseURI': 'https://api.zoom.us',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      defaultValue: r => r?.http?.auth?.type || '',
      label: 'Authentication type',
      helpKey: 'zoom.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'JWT', value: 'jwt' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    'http.encrypted.apiKey': {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      helpKey: 'zoom.connection.http.encrypted.apiKey',
      label: 'API key',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      visibleWhen: [{ field: 'http.auth.type', is: ['jwt'] }],
    },
    'http.encrypted.apiSecret': {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      label: 'API secret',
      helpKey: 'zoom.connection.http.encrypted.apiSecret',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      visibleWhen: [{ field: 'http.auth.type', is: ['jwt'] }],
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      helpKey: 'zoom.connection.http._iClientId',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
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
        fields: ['http.auth.type', 'http.encrypted.apiKey', 'http.encrypted.apiSecret', 'http._iClientId', 'http.auth.oauth.callbackURL'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
  actions: [
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
      id: 'oauthandcancel',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
      ],
    },
    {
      id: 'testandsavegroup',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['jwt'],
        },
      ],
    },
  ],
};
