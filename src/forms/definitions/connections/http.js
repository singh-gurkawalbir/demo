export default {
  preSave: formValues => {
    const newValues = Object.assign({}, formValues);

    delete newValues['/mode'];

    if (!newValues['/http/ping/successPath']) {
      newValues['/http/ping/successValues'] = undefined;
    }

    if (!newValues['/http/auth/oauth/failPath']) {
      newValues['/http/auth/oauth/failValues'] = undefined;
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

    if (newValues['/http/oauth/encrypted']) {
      try {
        newValues['/http/oauth/encrypted'] = JSON.parse(
          newValues['/http/oauth/encrypted']
        );
      } catch (ex) {
        newValues['/http/oauth/encrypted'] = undefined;
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

    if (newValues['/http/oauth/unencrypted']) {
      try {
        newValues['/http/oauth/unencrypted'] = JSON.parse(
          newValues['/http/oauth/unencrypted']
        );
      } catch (ex) {
        newValues['/http/oauth/unencrypted'] = undefined;
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

    if (newValues['/http/auth/type'] === 'oauth') {
      newValues['/http/auth/oauth/applicationType'] = 'custom';
      newValues['/http/headers'] = newValues['/http/oauth/headers'];
      newValues['/http/baseURI'] = newValues['/http/oauth/baseURI'];
      newValues['/http/mediaType'] = newValues['/http/oauth/mediaType'];
      newValues['/http/encrypted'] = newValues['/http/oauth/encrypted'];
      newValues['/http/unencrypted'] = newValues['/http/oauth/unencrypted'];
      newValues['/http/auth/failStatusCode'] =
        newValues['/http/auth/oauth/failStatusCode'];
      newValues['/http/auth/failPath'] = newValues['/http/auth/oauth/failPath'];
      newValues['/http/auth/failValues'] =
        newValues['/http/auth/oauth/failValues'];
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

    if (!newValues['/http/auth/token/revoke/uri'])
      delete newValues['/http/auth/token/revoke/uri'];

    if (!newValues['/http/auth/token/revoke/body'])
      delete newValues['/http/auth/token/revoke/body'];

    delete newValues['/http/oauth/headers'];
    delete newValues['/http/oauth/baseURI'];
    delete newValues['/http/oauth/mediaType'];
    delete newValues['/http/oauth/encrypted'];
    delete newValues['/http/oauth/unencrypted'];
    delete newValues['/http/auth/oauth/failStatusCode'];
    delete newValues['/http/auth/oauth/failPath'];
    delete newValues['/http/auth/oauth/failValues'];
    delete newValues['/http/auth/oauth/location'];
    delete newValues['/http/auth/oauth/headerName'];
    delete newValues['/http/auth/oauth/scheme'];
    delete newValues['/http/auth/oauth/paramName'];
    delete newValues['/http/oauth/customAuthScheme'];
    delete newValues['/http/auth/wsse/headerName'];

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
            { label: 'On-Premise', value: 'onpremise' },
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
      visibleWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.auth.failStatusCode': {
      fieldId: 'http.auth.failStatusCode',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.auth.failPath': {
      fieldId: 'http.auth.failPath',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.auth.failValues': {
      fieldId: 'http.auth.failValues',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.baseURI': {
      fieldId: 'http.baseURI',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.mediaType': {
      fieldId: 'http.mediaType',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
    },
    'http.encrypted': {
      fieldId: 'http.encrypted',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
      defaultValue: r =>
        (r && r.http && r.http.encrypted && JSON.stringify(r.http.encrypted)) ||
        '{"field": "value"}',
    },
    'http.disableStrictSSL': { fieldId: 'http.disableStrictSSL' },
    'http.unencrypted': {
      fieldId: 'http.unencrypted',
      visibleWhen: [{ field: 'http.auth.type', isNot: ['oauth'] }],
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
      label: 'Header Name',
      helpText:
        "By default, integrator.io will send all authentication type info in the 'Authorization: HTTP header field.  If the API you are connecting to requires a different HTTP header, use this field to provide an override.",
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
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
        { field: 'http.auth.oauth.grantType', is: ['authorizecode'] },
      ],
    },
    customScopeDelimiter: {
      id: 'customScopeDelimiter',
      type: 'checkbox',
      label: 'This provider uses a scope delimiter other than space',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      helpText:
        'If your provider does not use spaces to delimit scopes, check this box, then provide the custom scope delimiter for your provider.',
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
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
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
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.clientCredentialsLocation': {
      fieldId: 'http.auth.oauth.clientCredentialsLocation',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.oauth.headers': {
      id: 'http.oauth.headers',
      type: 'keyvalue',
      keyName: 'name',
      valueName: 'value',
      valueType: 'keyvalue',
      defaultValue: r => (r && r.http && r.http.headers) || '',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      label: 'Configure HTTP Headers',
      helpText:
        "In some rare cases, it may be necessary to include custom HTTP headers with your API requests.  The appropriate 'content-type' header is automatically added by integrator.io based on the mediaType value described in the connection associated with this request (typically 'application/json'). Note that if the authentication method described in the associated connection requires a header value, this will also be added automatically.  This header field is used in the rare case that an API requires additional headers other than these two.",
    },
    'http.auth.oauth.failStatusCode': {
      id: 'http.auth.oauth.failStatusCode',
      type: 'text',
      label: 'Authentication Fail Status Code',
      helpText:
        'The HTTP specification states that authentication errors should return a 401 status code.  Some services have custom authentication implementations that rely on other status codes, or return 200 and indicate auth errors within the HTTP body. Use this field if the service you are connecting to uses a status code other than 401.',
      defaultValue: r =>
        r && r.http && r.http.auth && r.http.auth.failStatusCode,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      validWhen: [
        {
          matchesRegEx: {
            pattern: '^[\\d]+$',
            message: 'Only numbers allowed',
          },
        },
      ],
    },
    'http.auth.oauth.failPath': {
      id: 'http.auth.oauth.failPath',
      type: 'text',
      label: 'Authentication Fail Path',
      helpText:
        'If the service you are connecting to embeds authentication errors within the HTTP body, use this field to set the path within the response body where integrator.io should look to identify a failed auth response. If there is a specific value (or set of values) that indicate a failed auth response at this path, use the failValues field to further instruct our platform on how to identify this type of error.',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.failPath,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.auth.oauth.failValues': {
      id: 'http.auth.oauth.failValues',
      type: 'text',
      delimiter: ',',
      helpText:
        'This field is used only if the failPath field is set. It indicates to integrator.io what specific values to test for when determining if the requests we made failed for authentication reasons.',
      label: 'Authentication Fail Values',
      defaultValue: r => r && r.http && r.http.auth && r.http.auth.failValues,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.oauth.baseURI': {
      id: 'http.oauth.baseURI',
      type: 'text',
      label: 'Base URI',
      required: true,
      helpText:
        "The common part of an API's URL - used across all the different HTTP endpoints you will invoke.  Using a base URI in your connection makes it easier to configure all your exports and imports (because all you need then is a Relative URI).",
      defaultValue: r => r && r.http && r.http.baseURI,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.oauth.mediaType': {
      id: 'http.oauth.mediaType',
      type: 'select',
      label: 'Media Type',
      required: true,
      helpText:
        'The data format that should be used for all requests sent to, or responses received from (via HTTP) the API being connected to.  Typically a single API will only support one media type (data format) and will publish that info right at the top of their API guides. If the mediaType foe request/response are not the same, it is possible to override the mediaType for specific endpoints by using the export success/error media type fields.',
      defaultValue: r => (r && r.http && r.http.mediaType) || 'json',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
      options: [
        {
          items: [
            { label: 'XML', value: 'xml' },
            { label: 'JSON', value: 'json' },
            { label: 'URL Encoded', value: 'urlencoded' },
          ],
        },
      ],
    },
    'http.oauth.encrypted': {
      id: 'http.oauth.encrypted',
      type: 'editor',
      mode: 'json',
      label: 'Encrypted',
      helpText:
        "Use this encrypted JSON field to store all the security sensitive fields needed by your imports and exports (to access the application being integrated).  For example:  {'password': 'ayTb53Img!do'} or {'token': 'x7ygd4njlwerf63nhg'}.  Please note that in addition to AES 256 encryption there are multiple layers of protection in place to keep your data safe.",
      defaultValue: r =>
        (r && r.http && r.http.encrypted && JSON.stringify(r.http.encrypted)) ||
        '{"field": "value"}',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },
    'http.oauth.unencrypted': {
      id: 'http.oauth.unencrypted',
      type: 'editor',
      mode: 'json',
      required: true,
      label: 'Unencrypted',
      helpText:
        "Use this JSON field to store all the non security sensitive fields needed by your imports and exports (to access the application being integrated).  For example: {'email':'my_email@company.com', 'accountId': '5765432', 'role': 'admin'}",
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
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
      helpText:
        "Where does your application's API expect to find the auth token? Choose 'url' if the auth token should be located in the url.  You will then be able to specify the query string parameter name that should hold the token value. If you choose 'header' you will then need to specify the header name and auth scheme to use when constructing the HTTP request. Finally, choose 'body' if your API needs the token embedded in the body structure of your HTTP request. In this case, its up to you to place the token in your body template using the placeholder: {{{connection.http.token.token}}}",
      defaultValue: r =>
        r &&
        r.http &&
        r.http.auth &&
        r.http.auth.token &&
        r.http.auth.token.location,
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
      label: 'Header Name',
      helpText:
        "By default, integrator.io will send all authentication type info in the 'Authorization: HTTP header field.  If the API you are connecting to requires a different HTTP header, use this field to provide an override.",
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
      helpText:
        'By default, integrator.io will follow the HTTP specs with regards to auth scheme names (i.e. Bearer, OAuth, MAC, etc...), but if the API you are connecting to does not follow the specs exactly, this field can be used to provide an override.',
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
      label: 'Custom Auth Scheme',
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
      label: 'Parameter Name',
      helpText:
        "Use this field to specify the name of the URL parameter that will hold the API token value.  For example, if you specify 'myAPITokenURLParam' then all HTTP requests will include the following: '?myAPITokenURLParam=[token]'.",
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
      label: 'Refresh Body',
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
      helpText:
        "In some cases, it may be necessary to include custom HTTP headers with your token refresh requests. As with the 'body' field, any value from the connection can be referenced using {{{placeholders}} with a complete path matching the connection field.",
      label: 'Refresh Token Headers',
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
  },
  layout: {
    fields: [
      'name',
      'mode',
      '_agentId',
      'http.auth.type',
      'http.headers',
      'http.auth.failStatusCode',
      'http.auth.failPath',
      'http.auth.failValues',
      'http.baseURI',
      'http.mediaType',
      'http.encrypted',
      'http.unencrypted',
      'httpBasic',
      'httpToken',
      'httpCookie',
      'http.auth.wsse.headerName',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'OAuth authorization settings',
        fields: [
          'http.auth.oauth.grantType',
          'http._iClientId',
          'http.auth.oauth.callbackURL',
          'http.auth.oauth.authURI',
          'http.auth.oauth.scope',
          'customScopeDelimiter',
          'http.auth.oauth.scopeDelimiter',
          'http.auth.oauth.tokenURI',
          'http.auth.oauth.clientCredentialsLocation',
        ],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Access Token Parameters',
            fields: [
              'http.auth.oauth.accessTokenHeaders',
              'http.auth.oauth.accessTokenBody',
            ],
          },
          {
            collapsed: true,
            label: 'Refresh Token Parameters',
            fields: [
              'http.auth.oauth.refreshHeaders',
              'http.auth.oauth.refreshBody',
            ],
          },
          {
            collapsed: true,
            label: 'Revoke Parameters',
            fields: [
              'http.auth.token.revoke.uri',
              'http.auth.token.revoke.body',
              'http.auth.token.revoke.headers',
            ],
          },
        ],
      },
      {
        collapsed: true,
        label: 'HTTP resource settings',
        fields: [
          'http.oauth.headers',
          'http.oauth.baseURI',
          'http.oauth.mediaType',
          'http.oauth.encrypted',
          'http.oauth.unencrypted',
          'http.auth.oauth.failStatusCode',
          'http.auth.oauth.failPath',
          'http.auth.oauth.failValues',
        ],
      },
      {
        collapsed: true,
        label: 'How to send token?',
        fields: [
          'http.auth.oauth.location',
          'http.auth.oauth.headerName',
          'http.auth.oauth.scheme',
          'http.oauth.customAuthScheme',
          'http.auth.oauth.paramName',
        ],
      },
      {
        collapsed: true,
        label: 'API Rate Limits',
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
        label: 'How to test connection?',
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
        label: 'Advanced Settings',
        fields: [
          'http.disableStrictSSL',
          'httpAdvanced',
          'http.clientCertificates.key',
          'http.clientCertificates.cert',
          'http.clientCertificates.passphrase',
        ],
      },
    ],
  },
  actions: [
    {
      id: 'cancel',
    },
    {
      id: 'test',
      label: 'Test',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token', 'basic', 'custom', 'cookie', 'digest', 'oauth', 'wsse'],
        },
      ],
    },
    {
      id: 'saveandcontinue',
      label: 'Save & Continue',
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
      label: 'Save & Authorize',
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
      label: 'Test and Save',
      visibleWhen: [
        {
          field: 'http.auth.type',
          is: ['token', 'basic', 'custom', 'cookie', 'digest', 'wsse'],
        },
      ],
    },
  ],
};
