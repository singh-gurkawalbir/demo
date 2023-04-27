export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'token') {
      retValues['/http/auth/token/location'] = 'url';
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/token/paramName'] = 'api_token';
      retValues['/http/auth/oauth/authURI'] = undefined;
      retValues['/http/auth/oauth/tokenURI'] = undefined;
      retValues['/http/auth/oauth/grantType'] = undefined;
      retValues['/http/auth/oauth/clientCredentialsLocation'] = undefined;
      retValues['/http/auth/token/refreshMethod'] = undefined;
      retValues['/http/auth/token/refreshMediaType'] = undefined;
    } else {
      retValues['/http/auth/oauth/authURI'] = 'https://oauth.pipedrive.com/oauth/authorize';
      retValues['/http/auth/oauth/tokenURI'] = 'https://oauth.pipedrive.com/oauth/token';
      retValues['/http/auth/oauth/grantType'] = 'authorizecode';
      retValues['/http/auth/oauth/clientCredentialsLocation'] = 'basicauthheader';
      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/token/location'] = 'header';
      retValues['/http/auth/token/scheme'] = 'Bearer';
      retValues['/http/auth/token/headerName'] = 'Authorization';
      retValues['/http/auth/token/refreshMethod'] = 'POST';
      retValues['/http/auth/token/refreshMediaType'] = 'urlencoded';
      retValues['/http/auth/token/paramName'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'pipedrive',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://${formValues['/http/subdomain']}.pipedrive.com`,
      '/http/ping/relativeURI': '/api/v1/users/me',
      '/http/ping/method': 'GET',
    };
  },
  fieldMap: {
    name: {
      fieldId: 'name',
    },
    'http.auth.type': {
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication type',
      isLoggable: true,
      helpKey: 'pipedrive.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Token', value: 'token' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    'http.subdomain': {
      type: 'text',
      id: 'http.subdomain',
      startAdornment: 'https://',
      endAdornment: '.pipedrive.com',
      label: 'Subdomain',
      required: true,
      helpKey: 'pipedrive.connection.http.subdomain',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseURI = r?.http?.baseURI;
        const subdomain =
        baseURI &&
        baseURI.substring(
          baseURI.indexOf('https://') + 8,
          baseURI.indexOf('.pipedrive.com')
        );

        return subdomain;
      },
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
    },
    'http.auth.token.token': {
      fieldId: 'http.auth.token.token',
      defaultValue: '',
      label: 'API token',
      required: true,
      helpKey: 'pipedrive.connection.http.auth.token.token',
      visibleWhen: [{ field: 'http.auth.type', is: ['token'] }],
      removeWhen: [{ field: 'http.auth.type', isNot: ['token'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    application: {
      fieldId: 'application',
    },
    httpAdvanced: {
      formId: 'httpAdvanced',
    },
  },
  layout: {
    type: 'collapse',
    containers: [{
      collapsed: true,
      label: 'General',
      fields: ['name', 'application'],
    },
    {
      collapsed: true,
      label: 'Application details',
      fields: ['http.auth.type',
        'http.subdomain',
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
          is: ['token'],
        },
      ],
    },
  ],
};
