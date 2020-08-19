export default {
  preSave: formValues => {
    const newValues = { ...formValues};

    if (newValues['/mode'] === 'cloud') {
      newValues['/_agentId'] = undefined;
    }
    delete newValues['/mode'];

    if (!newValues['/http/ping/successPath']) {
      newValues['/http/ping/successValues'] = undefined;
    }

    if (!newValues['/http/rateLimit/failPath']) {
      newValues['/http/rateLimit/failValues'] = undefined;
    }

    if (!newValues['/http/ping/failPath']) {
      newValues['/http/ping/failValues'] = undefined;
    }

    if (newValues['/http/ping/method'] === 'GET') {
      newValues['/http/ping/body'] = undefined;
    }

    if (newValues['/http/encrypted']) {
      try {
        newValues['/http/encrypted'] = JSON.parse(newValues['/http/encrypted']);
      } catch (ex) {
        newValues['/http/encrypted'] = undefined;
      }
    }

    if (newValues['/http/custom/encrypted']) {
      try {
        newValues['/http/custom/encrypted'] = JSON.parse(
          newValues['/http/custom/encrypted']
        );
      } catch (ex) {
        newValues['/http/custom/encrypted'] = undefined;
      }
    }

    if (newValues['/http/unencrypted']) {
      try {
        newValues['/http/unencrypted'] = JSON.parse(
          newValues['/http/unencrypted']
        );
      } catch (ex) {
        newValues['/http/unencrypted'] = undefined;
      }
    }

    if (newValues['/http/custom/unencrypted']) {
      try {
        newValues['/http/custom/unencrypted'] = JSON.parse(
          newValues['/http/custom/unencrypted']
        );
      } catch (ex) {
        newValues['/http/custom/unencrypted'] = undefined;
      }
    }

    if (
      newValues['/http/auth/type'] !== 'basic' &&
      newValues['/http/auth/type'] !== 'digest' &&
      newValues['/http/auth/type'] !== 'wsse'
    ) {
      delete newValues['/http/auth/basic/username'];
      delete newValues['/http/auth/basic/password'];
      newValues['/http/auth/basic'] = undefined;
    }

    if (
      newValues['/http/auth/type'] !== 'token' ||
      !formValues['/configureTokenRefresh']
    ) {
      delete newValues['/http/auth/token/refreshMethod'];
      delete newValues['/http/auth/token/refreshTokenPath'];
      delete newValues['/http/auth/token/refreshTokenHeaders'];
      delete newValues['/http/auth/token/refreshToken'];
      delete newValues['/http/auth/token/refreshBody'];
      delete newValues['/http/auth/token/refreshRelativeURI'];
      delete newValues['/http/auth/token/refreshMediaType'];
    }

    if (newValues['/http/auth/type'] === 'token') {
      if (newValues['/http/auth/token/scheme'] === 'Custom') {
        newValues['/http/auth/token/scheme'] =
          newValues['/http/customAuthScheme'];
      }
    }

    if (newValues['/http/auth/type'] !== 'token') {
      delete newValues['/http/auth/token/token'];
      delete newValues['/http/auth/token/scheme'];
      delete newValues['/http/auth/token/headerName'];
      delete newValues['/http/auth/token/location'];
      delete newValues['/http/auth/token/paramName'];
    }

    if (newValues['/http/auth/type'] !== 'cookie') {
      if (newValues['/http/auth/cookie/method'] === 'GET') {
        delete newValues['/http/auth/cookie/body'];
      }

      delete newValues['/http/auth/cookie/method'];
      delete newValues['/http/auth/cookie/uri'];
    }

    if (newValues['/http/auth/type'] === 'wsse') {
      newValues['/http/auth/token/headerName'] =
        newValues['/http/auth/wsse/headerName'];
    }
    if (newValues['/http/auth/type'] === 'custom') {
      newValues['/http/encrypted'] =
        newValues['/http/custom/encrypted'];
      newValues['/http/unencrypted'] =
        newValues['/http/custom/unencrypted'];
    }
    if (newValues['/http/auth/type'] === 'oauth') {
      newValues['/http/auth/oauth/applicationType'] = 'custom';
      newValues['/http/auth/token/location'] =
        newValues['/http/auth/oauth/location'];
      newValues['/http/auth/token/headerName'] =
        newValues['/http/auth/oauth/headerName'];
      newValues['/http/auth/token/scheme'] =
        newValues['/http/auth/oauth/scheme'];
      newValues['/http/auth/token/paramName'] =
        newValues['/http/auth/oauth/paramName'];
      newValues['/http/auth/customAuthScheme'] =
        newValues['/http/oauth/customAuthScheme'];
    }

    if (!newValues['/http/auth/token/revoke/uri']) delete newValues['/http/auth/token/revoke/uri'];

    if (!newValues['/http/auth/token/revoke/body']) delete newValues['/http/auth/token/revoke/body'];

    if (!newValues['/http/auth/failPath']) {
      newValues['/http/auth/failValues'] = undefined;
    }

    delete newValues['/http/auth/oauth/location'];
    delete newValues['/http/auth/oauth/headerName'];
    delete newValues['/http/auth/oauth/scheme'];
    delete newValues['/http/auth/oauth/paramName'];
    delete newValues['/http/oauth/customAuthScheme'];
    delete newValues['/http/auth/wsse/headerName'];
    delete newValues['/http/custom/encrypted'];
    delete newValues['/http/custom/unencrypted'];

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode',
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
    },
    'http.auth.type': { fieldId: 'http.auth.type' },
    'http.headers': {
      fieldId: 'http.headers',
    },
    'http.auth.failStatusCode': {
      fieldId: 'http.auth.failStatusCode',
    },
    'http.auth.failPath': {
      fieldId: 'http.auth.failPath',
    },
    'http.auth.failValues': {
      fieldId: 'http.auth.failValues',
    },
    'http.baseURI': {
      fieldId: 'http.baseURI',
    },
    'http.mediaType': {
      fieldId: 'http.mediaType',
    },
    'http.successMediaType': {
      fieldId: 'http.successMediaType',
    },
    'http.errorMediaType': {
      fieldId: 'http.errorMediaType',
    },
    'http.encrypted': {
      fieldId: 'http.encrypted',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['custom'] }],
      defaultValue: r =>
        (r && r.http && r.http.encrypted && JSON.stringify(r.http.encrypted)) ||
        '{"field": "value"}',
    },
    'http.disableStrictSSL': { fieldId: 'http.disableStrictSSL' },
    'http.unencrypted': {
      fieldId: 'http.unencrypted',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['custom'] }],
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          JSON.stringify(r.http.unencrypted)) ||
        '{"field": "value"}',
    },
    httpBasic: {
      formId: 'httpBasic',
      visibleWhen: [
        { field: 'http.auth.type', is: ['basic', 'digest', 'wsse'] },
      ],
    },
    httpToken: {
      formId: 'httpToken',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['token'] }],
    },
    httpCookie: {
      formId: 'httpCookie',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['cookie'] }],
    },
    'http.auth.wsse.headerName': {
      id: 'http.auth.wsse.headerName',
      type: 'text',
      label: 'Header name',
      helpKey: 'connection.http.auth.token.headerName',
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.auth &&
          r.http.auth.token &&
          r.http.auth.token.headerName) ||
        'X-WSSE',
      visibleWhen: [{ field: 'http.auth.type', is: ['wsse'] }],
    },
    'http.rateLimit.limit': { fieldId: 'http.rateLimit.limit' },
    'http.rateLimit.failStatusCode': {
      fieldId: 'http.rateLimit.failStatusCode',
    },
    'http.rateLimit.failPath': { fieldId: 'http.rateLimit.failPath' },
    'http.rateLimit.failValues': { fieldId: 'http.rateLimit.failValues' },
    'http.retryHeader': { fieldId: 'http.retryHeader' },
    'http.ping.relativeURI': { fieldId: 'http.ping.relativeURI' },
    'http.ping.method': { fieldId: 'http.ping.method' },
    'http.ping.body': {
      fieldId: 'http.ping.body',
      visibleWhenAll: [{ field: 'http.ping.method', is: ['POST', 'PUT'] }],
    },
    'http.ping.successPath': { fieldId: 'http.ping.successPath' },
    'http.ping.successValues': { fieldId: 'http.ping.successValues' },
    'http.ping.errorPath': { fieldId: 'http.ping.errorPath' },
    'http.ping.failPath': { fieldId: 'http.ping.failPath' },
    'http.ping.failValues': { fieldId: 'http.ping.failValues' },
    httpAdvanced: { formId: 'httpAdvanced' },
    'http.clientCertificates.cert': { fieldId: 'http.clientCertificates.cert' },
    'http.clientCertificates.key': { fieldId: 'http.clientCertificates.key' },
    'http.clientCertificates.passphrase': {
      fieldId: 'http.clientCertificates.passphrase',
    },
    'http.auth.oauth.applicationType': {
      fieldId: 'http.auth.oauth.applicationType',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.callbackURL': {
      fieldId: 'http.auth.oauth.callbackURL',
      copyToClipboard: true,
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    customScopeDelimiter: {
      id: 'customScopeDelimiter',
      type: 'checkbox',
      label: 'This provider uses a scope delimiter other than space',
      defaultValue: r =>
        !!(
          r &&
          r.http &&
          r.http.auth &&
          r.http.auth.oauth &&
          r.http.auth.oauth.scopeDelimiter
        ),
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
      helpKey: 'http.connection.customScopeDelimiter',
    },
    'http.auth.oauth.type': {
      fieldId: 'http.auth.oauth.type',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.grantType': {
      fieldId: 'http.auth.oauth.grantType',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.scope': {
      id: 'http.auth.oauth.scope',
      type: 'text',
      label: 'Scopes',
      delimiter: ',',
      helpKey: 'connection.generic.http.auth.oauth.scope',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.oauth.scopeDelimiter': {
      fieldId: 'http.auth.oauth.scopeDelimiter',
      required: true,
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
        { field: 'customScopeDelimiter', is: [true] },
      ],
    },
    'http.auth.oauth.tokenURI': {
      fieldId: 'http.auth.oauth.tokenURI',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.authURI': {
      fieldId: 'http.auth.oauth.authURI',
      required: true,
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.oauth.accessTokenHeaders': {
      fieldId: 'http.auth.oauth.accessTokenHeaders',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.accessTokenBody': {
      fieldId: 'http.auth.oauth.accessTokenBody',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
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
    'http.auth.oauth.clientCredentialsLocation': {
      fieldId: 'http.auth.oauth.clientCredentialsLocation',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.custom.encrypted': {
      id: 'http.custom.encrypted',
      type: 'editor',
      mode: 'json',
      label: 'Encrypted',
      helpKey: 'connection.http.encrypted',
      defaultValue: r =>
        (r && r.http && r.http.encrypted && JSON.stringify(r.http.encrypted)) ||
        '{"field": "value"}',
      visibleWhen: [{ field: 'http.auth.type', is: ['custom'] }],
    },
    'http.custom.unencrypted': {
      id: 'http.custom.unencrypted',
      type: 'editor',
      mode: 'json',
      required: true,
      label: 'Unencrypted',
      helpKey: 'connection.http.unencrypted',
      visibleWhen: [{ field: 'http.auth.type', is: ['custom'] }],
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          JSON.stringify(r.http.unencrypted)) ||
        '{"field": "value"}',
    },
    'http.auth.oauth.location': {
      id: 'http.auth.oauth.location',
      type: 'select',
      label: 'Location',
      helpKey: 'connection.http.auth.token.location',
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.auth &&
          r.http.auth.token &&
          r.http.auth.token.location) ||
        'header',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      required: true,
      options: [
        {
          items: [
            { label: 'URL Parameter', value: 'url' },
            { label: 'Header', value: 'header' },
            { label: 'Body', value: 'body' },
          ],
        },
      ],
    },
    'http.auth.oauth.headerName': {
      id: 'http.auth.oauth.headerName',
      type: 'text',
      label: 'Header name',
      helpKey: 'connection.http.auth.token.headerName',
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.auth &&
          r.http.auth.token &&
          r.http.auth.token.headerName) ||
        'Authorization',
      visibleWhenAll: [
        { field: 'http.auth.oauth.location', is: ['header'] },
        { field: 'http.auth.type', is: ['oauth'] },
      ],
    },
    'http.auth.oauth.scheme': {
      fieldId: 'http.auth.oauth.scheme',
      type: 'select',
      label: 'Scheme',
      required: true,
      helpKey: 'connection.http.auth.token.scheme',
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.auth &&
          r.http.auth.token &&
          r.http.auth.token.scheme) ||
        'Bearer',
      options: [
        {
          items: [
            { label: 'Bearer', value: 'Bearer' },
            { label: 'MAC', value: 'MAC' },
            { label: 'None', value: ' ' },
            { label: 'Custom', value: 'Custom' },
          ],
        },
      ],
      visibleWhenAll: [
        { field: 'http.auth.oauth.location', is: ['header'] },
        { field: 'http.auth.type', is: ['oauth'] },
      ],
    },
    'http.oauth.customAuthScheme': {
      id: 'http.oauth.customAuthScheme',
      type: 'text',
      label: 'Custom auth scheme',
      defaultValue: r => r && r.http && r.http.customAuthScheme,
      visibleWhenAll: [
        { field: 'http.auth.oauth.location', is: ['header'] },
        { field: 'http.auth.oauth.scheme', is: ['Custom'] },
        { field: 'http.auth.type', is: ['oauth'] },
      ],
    },
    'http.auth.oauth.paramName': {
      id: 'http.auth.oauth.paramName',
      type: 'text',
      label: 'Parameter name',
      helpKey: 'connection.http.auth.token.paramName',
      defaultValue: r =>
        r &&
        r.http &&
        r.http.auth &&
        r.http.auth.token &&
        r.http.auth.token.paramName,
      required: true,
      visibleWhenAll: [
        { field: 'http.auth.oauth.location', is: ['url'] },
        { field: 'http.auth.type', is: ['oauth'] },
      ],
    },
    'http.auth.oauth.refreshBody': {
      id: 'http.auth.oauth.refreshBody',
      type: 'httprequestbody',
      contentType: 'json',
      label: 'Refresh token body',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.oauth.refreshHeaders': {
      id: 'http.auth.oauth.refreshHeaders',
      type: 'keyvalue',
      keyName: 'name',
      valueName: 'value',
      valueType: 'keyvalue',
      helpKey: 'connection.http.auth.token.refreshHeaders',
      label: 'Refresh token headers',
      defaultValue: r =>
        r &&
        r.http &&
        r.http.auth &&
        r.http.auth.token &&
        r.http.auth.token.refreshHeaders,
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    'http.auth.token.revoke.uri': {
      fieldId: 'http.auth.token.revoke.uri',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.token.revoke.body': {
      fieldId: 'http.auth.token.revoke.body',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.token.revoke.headers': {
      fieldId: 'http.auth.token.revoke.headers',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    application: {
      fieldId: 'application',
    },
  },
  layout: {
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'General',
        fields: [
          'name',
          'application',
          'mode',
          '_agentId',
        ],
      },
      {
        collapsed: true,
        label: 'Application details',
        fields: [
          'http.headers',
          'http.baseURI',
          'http.mediaType',
          'http.successMediaType',
          'http.errorMediaType',
        ],
      },
      {
        collapsed: true,
        label: 'Configure auth',
        fields: [
          'http.auth.type',
          'httpBasic',
          'httpToken',
          'httpCookie',
          'http.custom.encrypted',
          'http.custom.unencrypted',
          'http.auth.wsse.headerName',
          'http.auth.oauth.grantType',
          'http.auth.oauth.callbackURL',
          'http._iClientId',
          'http.auth.oauth.authURI',
          'http.auth.oauth.scope',
          'customScopeDelimiter',
          'http.auth.oauth.scopeDelimiter',
          'http.auth.oauth.tokenURI',
          'http.auth.oauth.clientCredentialsLocation',
          'http.auth.oauth.accessTokenHeaders',
          'http.auth.oauth.accessTokenBody',
          'http.auth.oauth.refreshHeaders',
          'http.auth.oauth.refreshBody',
          'http.auth.token.revoke.uri',
          'http.auth.token.revoke.headers',
          'http.auth.token.revoke.body',
          'http.auth.oauth.location',
          'http.auth.oauth.headerName',
          'http.auth.oauth.scheme',
          'http.oauth.customAuthScheme',
          'http.auth.oauth.paramName',
          'http.auth.failStatusCode',
          'http.auth.failPath',
          'http.auth.failValues',
        ],
      },
      {
        collapsed: true,
        label: 'Non-standard API rate limiter',
        fields: [
          'http.rateLimit.limit',
          'http.rateLimit.failStatusCode',
          'http.rateLimit.failPath',
          'http.rateLimit.failValues',
          'http.retryHeader',
        ],
      },
      {
        collapsed: true,
        label: 'How to test this connection?',
        fields: [
          'http.ping.relativeURI',
          'http.ping.method',
          'http.ping.body',
          'http.ping.successPath',
          'http.ping.successValues',
          'http.ping.failPath',
          'http.ping.failValues',
          'http.ping.errorPath',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: [
          'http.disableStrictSSL',
          'httpAdvanced',
          'http.clientCertificates.key',
          'http.clientCertificates.cert',
          'http.clientCertificates.passphrase',
          'http.encrypted',
          'http.unencrypted',
        ],
      },
    ],
  },
  actions: [
    {
      id: 'saveandcontinue',
      label: 'Save & continue',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
        { field: 'http.auth.oauth.grantType', is: ['clientcredentials'] },
      ],
    },
    {
      id: 'oauth',
      label: 'Save & authorize',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
        { field: 'http.auth.oauth.grantType', isNot: ['clientcredentials'] },
      ],
    },
    {
      id: 'save',
      label: 'Test and save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          isNot: ['oauth'],
        },
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
    },
    {
      id: 'saveandclose',
      visibleWhen: [
        {
          field: 'http.auth.type',
          isNot: ['oauth'],
        },
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
    },
    {
      id: 'cancel',
    },
    {
      id: 'test',
      label: 'Test',
      mode: 'secondary',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token', 'basic', 'custom', 'cookie', 'digest', 'oauth', 'wsse'],
        },
      ],
    },
  ],
};
