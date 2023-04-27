export default {
  preSave: formValues => {
    const retValues = { ...formValues };

    if (retValues['/http/auth/type'] === 'cookie') {
      retValues['/http/baseURI'] = `${formValues['/instanceURI']}/${
        formValues['/http/unencrypted/endpointName'].toLowerCase()
      }/${formValues['/http/unencrypted/endpointVersion']}`;
      retValues['/http/auth/cookie/method'] = 'POST';
      retValues['/http/auth/cookie/successStatusCode'] = 204;
      retValues['/http/ping/method'] = 'GET';
      retValues['/http/ping/relativeURI'] = `${
        formValues['/http/unencrypted/endpointName'].toLowerCase() === 'manufacturing' ? '/ProductionOrder' : '/FinancialPeriod'
      }`;
      retValues['/http/auth/cookie/uri'] = `${
        formValues['/instanceURI']
      }/auth/login`;
      retValues['/http/auth/cookie/body'] = `{"name": "${
        formValues['/http/unencrypted/username']
      }","password": "{{{connection.http.encrypted.password}}}","company": "${
        formValues['/http/unencrypted/company']
      }"}`;
      retValues['/http/encrypted/cookieString'] = '';
      retValues['/http/unencrypted/endpointName'] = `${formValues['/http/unencrypted/endpointName'].toLowerCase()}`;
      retValues['/http/auth/token/token'] = '';
      delete retValues['/http/auth/oauth/authURI'];
      delete retValues['/http/auth/oauth/tokenURI'];
      delete retValues['/http/auth/oauth/scopeDelimiter'];
      retValues['/http/auth/oauth'] = undefined;
    } else {
      retValues['/http/baseURI'] = `${
        formValues['/oauth/instanceURI']
      }/${formValues['/http/unencrypted/endpointName'].toLowerCase()}/${
        formValues['/http/unencrypted/endpointVersion']
      }`;
      retValues['/http/auth/oauth/useIClientFields'] = false;
      retValues['/http/auth/oauth/authURI'] = `${
        formValues['/oauth/instanceURI'].replace('/entity', '')}/identity/connect/authorize`;
      retValues['/http/auth/oauth/tokenURI'] = `${
        formValues['/oauth/instanceURI'].replace('/entity', '')}/identity/connect/token`;
      retValues['/http/unencrypted/endpointName'] = `${formValues['/http/unencrypted/endpointName'].toLowerCase()}`;
      retValues['/http/auth/oauth/scopeDelimiter'] = ' ';
      delete retValues['/http/auth/cookie/method'];
      delete retValues['/http/auth/cookie/successStatusCode'];
      delete retValues['/http/auth/cookie/uri'];
      delete retValues['/http/auth/cookie/body'];
      delete retValues['/http/encrypted/cookieString'];
      delete retValues['/http/unencrypted/password'];
      delete retValues['/http/encrypted/cookieString'];
      delete retValues['/http/unencrypted/company'];
      retValues['/http/auth/cookie'] = undefined;
    }

    return {
      ...retValues,
      '/type': 'http',
      '/assistant': 'acumatica',
      '/http/mediaType': 'json',
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.auth.type': {
      isLoggable: true,
      id: 'http.auth.type',
      required: true,
      type: 'select',
      label: 'Authentication type',
      helpKey: 'acumatica.connection.http.auth.type',
      options: [
        {
          items: [
            { label: 'Cookie', value: 'cookie' },
            { label: 'OAuth 2.0', value: 'oauth' },
          ],
        },
      ],
    },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
      isLoggable: true,
      defaultValue: r => (r && r._agentId ? 'onpremise' : 'cloud'),
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
      removeWhen: [{ field: 'mode', is: ['cloud'] }],
    },
    instanceURI: {
      id: 'instanceURI',
      type: 'text',
      label: 'Instance URI',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'acumatica.connection.instanceURI',
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;

        if (baseUri && baseUri.includes('/entity')) {
          return baseUri && baseUri.substring(0, baseUri.indexOf('/entity') + 7);
        }

        return baseUri && baseUri.substring(0, baseUri.indexOf(r?.http?.unencrypted?.endpointName));
      },
      deleteWhen: [{ field: 'http.auth.type', isNot: ['cookie'] }],
    },
    'oauth.instanceURI': {
      id: 'oauth.instanceURI',
      type: 'text',
      label: 'Instance URI',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      helpKey: 'acumatica.connection.instanceURI',
      defaultValue: r => {
        const baseUri = r?.http?.baseURI;

        if (baseUri && baseUri.includes('/entity')) {
          return baseUri && baseUri.substring(0, baseUri.indexOf('/entity') + 7);
        }

        return baseUri && baseUri.substring(0, baseUri.indexOf(r?.http?.unencrypted?.endpointName));
      },
    },
    'http.unencrypted.endpointName': {
      id: 'http.unencrypted.endpointName',
      type: 'text',
      helpKey: 'acumatica.connection.http.unencrypted.endpointName',
      label: 'Endpoint name',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', isNot: [''] }],
      defaultValue: r =>
        (r?.http?.unencrypted?.endpointName) ||
        'Default',
    },
    'http.unencrypted.endpointVersion': {
      id: 'http.unencrypted.endpointVersion',
      type: 'text',
      helpKey: 'acumatica.connection.http.unencrypted.endpointVersion',
      label: 'Endpoint version',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', isNot: [''] }],
      defaultValue: r =>
        (r?.http?.unencrypted?.endpointVersion) ||
        '20.200.001',
    },
    'http.unencrypted.username': {
      id: 'http.unencrypted.username',
      type: 'text',
      label: 'Username',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      deleteWhen: [{ field: 'http.auth.type', isNot: ['cookie'] }],
      helpKey: 'acumatica.connection.http.unencrypted.username',
    },
    'http.encrypted.password': {
      id: 'http.encrypted.password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'acumatica.connection.http.encrypted.password',
    },
    'http.unencrypted.company': {
      id: 'http.unencrypted.company',
      type: 'text',
      label: 'Company',
      visibleWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
      helpKey: 'acumatica.connection.http.unencrypted.company',
    },
    'http.auth.oauth.scope': {
      fieldId: 'http.auth.oauth.scope',
      scopes: ['api', 'offline_access', 'api:concurrent_access'],
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      deleteWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
    },
    'http._iClientId': {
      fieldId: 'http._iClientId',
      required: true,
      filter: { provider: 'custom_oauth2' },
      type: 'dynaiclient',
      connectionId: r => r && r._id,
      connectorId: r => r && r._connectorId,
      ignoreEnvironmentFilter: true,
      helpKey: 'connection.http._iClientId',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['oauth'] }],
      deleteWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhenAll: [{ field: 'http.auth.type', is: ['oauth'] }],
      deleteWhen: [{ field: 'http.auth.type', is: ['cookie'] }],
    },
    httpAdvanced: { formId: 'httpAdvanced' },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application', 'mode', '_agentId'] },
      { collapsed: true,
        label: 'Application details',
        fields: [
          'http.auth.type',
          'instanceURI',
          'oauth.instanceURI',
          'http.unencrypted.endpointName',
          'http.unencrypted.endpointVersion',
          'http.unencrypted.username',
          'http.encrypted.password',
          'http.unencrypted.company',
          'http.auth.oauth.scope',
          'http._iClientId',
          'http.auth.oauth.callbackURL'] },
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
      mode: 'secondary',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['cookie'],
        },
      ],
    },
  ],
};
