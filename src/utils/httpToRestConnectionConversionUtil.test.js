import { convertConnJSONObjHTTPtoREST } from './httpToRestConnectionConversionUtil';

describe('Testsuite for HTTP to REST connection conversion', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should test HTTP to REST connection convertion when a connection doesn\'t has http object', () => {
    const conn = {
      _id: 'conn_id',
      name: 'test connection name',
    };

    const httpToRest = convertConnJSONObjHTTPtoREST(conn);

    expect(httpToRest).toBe(conn);
  });
  test('should test HTTP to REST connection convertion when a connection has HTTP object and no value for assistant', () => {
    const httpData = {
      _id: 'conn_id',
      name: 'test connection name',
      assistant: '',
      http: {
        mediaType: 'mediaType',
        baseURI: 'baseURI',
        disableStrictSSL: 'disableStrictSSL',
        retryHeader: 'retryHeader',
        headers: 'headers',
        encrypted_crypt: 'encrypted_crypt',
        encrypted_salt: 'encrypted_salt',
        encrypted: 'encrypted',
        encryptedFields: 'encryptedFields',
        unencrypted: 'unencrypted',
        _iClientId: '_iClientId',
        _httpConnectorId: '_httpConnectorId',
        _httpConnectorVersionId: '_httpConnectorVersionId',
        concurrencyLevel: 'concurrencyLevel',
        'ping.relativeURI': 'pingRelativeURI',
        'ping.method': 'pingMethod',
        'ping.body': 'pingBody',
        'ping.successPath': 'pingSuccessPath',
        'ping.successValues': 'pingSuccessValues',
        'ping.failPath': 'pingFailurePath',
        'ping.failValues': 'pingFailureValues',
        'auth.type': 'authType',
        'auth.basic.username': 'basicAuth.username',
        'auth.basic.password_crypt': 'basicAuth.password_crypt',
        'auth.basic.password_salt': 'basicAuth.password_salt',
        'auth.basic.password': 'basicAuth.password', // For test cases
        'auth.oauth.authURI': 'authURI',
        'auth.oauth.useIClientFields': 'oauth.useIClientFields',
        'auth.oauth.tokenURI': 'oauthTokenURI',
        'auth.oauth.scope': 'scope',
        'auth.oauth.scopeDelimiter': 'scopeDelimiter',
        'auth.oauth.accessTokenPath': 'oauth.accessTokenPath',
        'auth.oauth.grantType': 'oauth.grantType',
        'auth.oauth.clientCredentialsLocation': 'oauth.clientCredentialsLocation',
        'auth.oauth.accessTokenBody': 'oauth.accessTokenBody',
        'auth.oauth.accessTokenHeaders': 'oauth.accessTokenHeaders',
        'auth.oauth.username': 'oauth.username',
        'auth.oauth.password_crypt': 'oauth.password_crypt',
        'auth.oauth.password_salt': 'oauth.password_salt',
        'auth.oauth.password': 'oauth.password', // For test cases
        'auth.token.token_crypt': 'bearerToken_crypt',
        'auth.token.token_salt': 'bearerToken_salt',
        'auth.token.token': 'bearerToken', // For test cases
        'auth.token.headerName': 'authHeader',
        'auth.token.scheme': 'authScheme',
        'auth.token.location': 'tokenLocation',
        'auth.token.paramName': 'tokenParam',
        'auth.token.refreshMethod': 'refreshTokenMethod',
        'auth.token.refreshMediaType': 'refreshTokenMediaType',
        'auth.token.refreshRelativeURI': 'refreshTokenURI',
        'auth.token.refreshBody': 'refreshTokenBody',
        'auth.token.refreshTokenPath': 'refreshTokenPath',
        'auth.token.refreshHeaders': 'refreshTokenHeaders',
        'auth.token.refreshToken_crypt': 'refreshToken_crypt',
        'auth.token.refreshToken_salt': 'refreshToken_salt',
        'auth.token.refreshToken': 'refreshToken', // For test cases
        'auth.cookie.uri': 'cookieAuth.uri',
        'auth.cookie.body': 'cookieAuth.body',
        'auth.cookie.method': 'cookieAuth.method',
        'auth.cookie.successStatusCode': 'cookieAuth.successStatusCode',
      },
    };
    const restData = {
      _id: 'conn_id',
      name: 'test connection name',
      assistant: '',
      rest: {
        mediaType: 'mediaType',
        baseURI: 'baseURI',
        disableStrictSSL: 'disableStrictSSL',
        retryHeader: 'retryHeader',
        headers: 'headers',
        encrypted_crypt: 'encrypted_crypt',
        encrypted_salt: 'encrypted_salt',
        encrypted: 'encrypted',
        encryptedFields: 'encryptedFields',
        unencrypted: 'unencrypted',
        _iClientId: '_iClientId',
        _httpConnectorId: '_httpConnectorId',
        _httpConnectorVersionId: '_httpConnectorVersionId',
        concurrencyLevel: 'concurrencyLevel',
        pingRelativeURI: 'pingRelativeURI',
        pingMethod: 'pingMethod',
        pingBody: 'pingBody',
        pingSuccessPath: 'pingSuccessPath',
        pingSuccessValues: 'pingSuccessValues',
        pingFailurePath: 'pingFailurePath',
        pingFailureValues: 'pingFailureValues',
        authType: 'authType',
        basicAuth: {
          username: 'basicAuth.username',
          password_crypt: 'basicAuth.password_crypt',
          password_salt: 'basicAuth.password_salt',
          password: 'basicAuth.password',
        },
        authURI: 'authURI',
        oauth: {
          useIClientFields: 'oauth.useIClientFields',
          accessTokenPath: 'oauth.accessTokenPath',
          grantType: 'oauth.grantType',
          clientCredentialsLocation: 'oauth.clientCredentialsLocation',
          accessTokenBody: 'oauth.accessTokenBody',
          accessTokenHeaders: 'oauth.accessTokenHeaders',
          username: 'oauth.username',
          password_crypt: 'oauth.password_crypt',
          password_salt: 'oauth.password_salt',
          password: 'oauth.password',
        },
        oauthTokenURI: 'oauthTokenURI',
        scope: 'scope',
        scopeDelimiter: 'scopeDelimiter',
        bearerToken_crypt: 'bearerToken_crypt',
        bearerToken_salt: 'bearerToken_salt',
        bearerToken: 'bearerToken',
        authHeader: 'authHeader',
        authScheme: 'authScheme',
        tokenLocation: 'tokenLocation',
        tokenParam: 'tokenParam',
        refreshTokenMethod: 'refreshTokenMethod',
        refreshTokenMediaType: 'refreshTokenMediaType',
        refreshTokenURI: 'refreshTokenURI',
        refreshTokenBody: 'refreshTokenBody',
        refreshTokenPath: 'refreshTokenPath',
        refreshTokenHeaders: 'refreshTokenHeaders',
        refreshToken_crypt: 'refreshToken_crypt',
        refreshToken_salt: 'refreshToken_salt',
        refreshToken: 'refreshToken',
        cookieAuth: {
          uri: 'cookieAuth.uri',
          body: 'cookieAuth.body',
          method: 'cookieAuth.method',
          successStatusCode: 'cookieAuth.successStatusCode',
        },
      },
      type: 'rest',
    };

    const httpToRest = convertConnJSONObjHTTPtoREST(httpData);

    expect(httpToRest).toEqual(restData);
  });
  test('should test HTTP to REST connection convertion when a connection has HTTP object and no value for assistant and HTTP object has header array', () => {
    const httpData = {
      _id: 'conn_id',
      name: 'test connection name',
      assistant: '',
      http: {
        mediaType: 'mediaType',
        baseURI: 'baseURI',
        disableStrictSSL: 'disableStrictSSL',
        retryHeader: 'retryHeader',
        encrypted_crypt: 'encrypted_crypt',
        encrypted_salt: 'encrypted_salt',
        encrypted: 'encrypted',
        encryptedFields: 'encryptedFields',
        unencrypted: 'unencrypted',
        _iClientId: '_iClientId',
        _httpConnectorId: '_httpConnectorId',
        _httpConnectorVersionId: '_httpConnectorVersionId',
        concurrencyLevel: 'concurrencyLevel',
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
          {
            name: 'version',
            value: '{{{connection.http.unencrypted.version}}}}',
          },
        ],
        'ping.relativeURI': 'pingRelativeURI',
        'ping.method': 'pingMethod',
        'ping.body': 'pingBody',
        'ping.successPath': 'pingSuccessPath',
        'ping.successValues': 'pingSuccessValues',
        'ping.failPath': 'pingFailurePath',
        'ping.failValues': 'pingFailureValues',
        'auth.type': 'authType',
        'auth.basic.username': 'basicAuth.username',
        'auth.basic.password_crypt': 'basicAuth.password_crypt',
        'auth.basic.password_salt': 'basicAuth.password_salt',
        'auth.basic.password': 'basicAuth.password', // For test cases
        'auth.oauth.authURI': 'authURI',
        'auth.oauth.useIClientFields': 'oauth.useIClientFields',
        'auth.oauth.tokenURI': 'oauthTokenURI',
        'auth.oauth.scope': 'scope',
        'auth.oauth.scopeDelimiter': 'scopeDelimiter',
        'auth.oauth.accessTokenPath': 'oauth.accessTokenPath',
        'auth.oauth.grantType': 'oauth.grantType',
        'auth.oauth.clientCredentialsLocation': 'oauth.clientCredentialsLocation',
        'auth.oauth.accessTokenBody': 'oauth.accessTokenBody',
        'auth.oauth.accessTokenHeaders': 'oauth.accessTokenHeaders',
        'auth.oauth.username': 'oauth.username',
        'auth.oauth.password_crypt': 'oauth.password_crypt',
        'auth.oauth.password_salt': 'oauth.password_salt',
        'auth.oauth.password': 'oauth.password', // For test cases
        'auth.token.token_crypt': 'bearerToken_crypt',
        'auth.token.token_salt': 'bearerToken_salt',
        'auth.token.token': 'bearerToken', // For test cases
        'auth.token.headerName': 'authHeader',
        'auth.token.scheme': 'authScheme',
        'auth.token.location': 'tokenLocation',
        'auth.token.paramName': 'tokenParam',
        'auth.token.refreshMethod': 'refreshTokenMethod',
        'auth.token.refreshMediaType': 'refreshTokenMediaType',
        'auth.token.refreshRelativeURI': 'refreshTokenURI',
        'auth.token.refreshBody': 'refreshTokenBody',
        'auth.token.refreshTokenPath': 'refreshTokenPath',
        'auth.token.refreshHeaders': 'refreshTokenHeaders',
        'auth.token.refreshToken_crypt': 'refreshToken_crypt',
        'auth.token.refreshToken_salt': 'refreshToken_salt',
        'auth.token.refreshToken': 'refreshToken', // For test cases
        'auth.cookie.uri': 'cookieAuth.uri',
        'auth.cookie.body': 'cookieAuth.body',
        'auth.cookie.method': 'cookieAuth.method',
        'auth.cookie.successStatusCode': 'cookieAuth.successStatusCode',
      },
    };
    const restData = {
      _id: 'conn_id',
      name: 'test connection name',
      assistant: '',
      rest: {
        mediaType: 'mediaType',
        baseURI: 'baseURI',
        disableStrictSSL: 'disableStrictSSL',
        retryHeader: 'retryHeader',
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
          {
            name: 'version',
            value: '{{{connection.rest.unencrypted.version}}}}',
          },
        ],
        encrypted_crypt: 'encrypted_crypt',
        encrypted_salt: 'encrypted_salt',
        encrypted: 'encrypted',
        encryptedFields: 'encryptedFields',
        unencrypted: 'unencrypted',
        _iClientId: '_iClientId',
        _httpConnectorId: '_httpConnectorId',
        _httpConnectorVersionId: '_httpConnectorVersionId',
        concurrencyLevel: 'concurrencyLevel',
        pingRelativeURI: 'pingRelativeURI',
        pingMethod: 'pingMethod',
        pingBody: 'pingBody',
        pingSuccessPath: 'pingSuccessPath',
        pingSuccessValues: 'pingSuccessValues',
        pingFailurePath: 'pingFailurePath',
        pingFailureValues: 'pingFailureValues',
        authType: 'authType',
        basicAuth: {
          username: 'basicAuth.username',
          password_crypt: 'basicAuth.password_crypt',
          password_salt: 'basicAuth.password_salt',
          password: 'basicAuth.password',
        },
        authURI: 'authURI',
        oauth: {
          useIClientFields: 'oauth.useIClientFields',
          accessTokenPath: 'oauth.accessTokenPath',
          grantType: 'oauth.grantType',
          clientCredentialsLocation: 'oauth.clientCredentialsLocation',
          accessTokenBody: 'oauth.accessTokenBody',
          accessTokenHeaders: 'oauth.accessTokenHeaders',
          username: 'oauth.username',
          password_crypt: 'oauth.password_crypt',
          password_salt: 'oauth.password_salt',
          password: 'oauth.password',
        },
        oauthTokenURI: 'oauthTokenURI',
        scope: 'scope',
        scopeDelimiter: 'scopeDelimiter',
        bearerToken_crypt: 'bearerToken_crypt',
        bearerToken_salt: 'bearerToken_salt',
        bearerToken: 'bearerToken',
        authHeader: 'authHeader',
        authScheme: 'authScheme',
        tokenLocation: 'tokenLocation',
        tokenParam: 'tokenParam',
        refreshTokenMethod: 'refreshTokenMethod',
        refreshTokenMediaType: 'refreshTokenMediaType',
        refreshTokenURI: 'refreshTokenURI',
        refreshTokenBody: 'refreshTokenBody',
        refreshTokenPath: 'refreshTokenPath',
        refreshTokenHeaders: 'refreshTokenHeaders',
        refreshToken_crypt: 'refreshToken_crypt',
        refreshToken_salt: 'refreshToken_salt',
        refreshToken: 'refreshToken',
        cookieAuth: {
          uri: 'cookieAuth.uri',
          body: 'cookieAuth.body',
          method: 'cookieAuth.method',
          successStatusCode: 'cookieAuth.successStatusCode',
        },
      },
      type: 'rest',
    };

    const httpToRest = convertConnJSONObjHTTPtoREST(httpData);

    expect(httpToRest).toEqual(restData);
  });
  test('should test HTTP to REST connection convertion when a connection has HTTP object and has scopes array', () => {
    const httpData = {
      _id: 'conn_id',
      name: 'test connection name',
      assistant: 'test',
      http: {
        mediaType: 'mediaType',
        baseURI: 'baseURI',
        disableStrictSSL: 'disableStrictSSL',
        retryHeader: 'retryHeader',
        encrypted_crypt: 'encrypted_crypt',
        encrypted_salt: 'encrypted_salt',
        encrypted: 'encrypted',
        encryptedFields: 'encryptedFields',
        unencrypted: 'unencrypted',
        _iClientId: '_iClientId',
        _httpConnectorId: '_httpConnectorId',
        _httpConnectorVersionId: '_httpConnectorVersionId',
        concurrencyLevel: 'concurrencyLevel',
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
          {
            name: 'user-name',
            value: '{{{connection.http.unencrypted.username}}}',
          },
          {
            name: 'password',
            value: '{{{connection.http.encrypted.password}}}',
          },
          {
            name: 'basic-auth',
            value: '{{{connection.http.auth.basic}}}',
          },
          {
            name: 'refreshToken',
            value: '{{{connection.http.auth.token.refreshToken}}}',
          },
          {
            name: 'token',
            value: '{{{connection.http.auth.token.token}}}',
          },
          {
            name: 'scope',
            value: '{{{connection.http.auth.oauth.scope}}}',
          },
          {
            name: 'version',
            value: '{{{connection.http.unencrypted.version}}}',
          },
        ],
        'ping.relativeURI': 'pingRelativeURI',
        'ping.method': 'pingMethod',
        'ping.body': 'pingBody',
        'ping.successPath': 'pingSuccessPath',
        'ping.successValues': 'pingSuccessValues',
        'ping.failPath': 'pingFailurePath',
        'ping.failValues': 'pingFailureValues',
        'auth.type': 'authType',
        'auth.basic.username': 'basicAuth.username',
        'auth.basic.password_crypt': 'basicAuth.password_crypt',
        'auth.basic.password_salt': 'basicAuth.password_salt',
        'auth.basic.password': 'basicAuth.password', // For test cases
        'auth.oauth.authURI': 'authURI',
        'auth.oauth.useIClientFields': 'oauth.useIClientFields',
        'auth.oauth.tokenURI': 'oauthTokenURI',
        'auth.oauth.scope': [
          'read(all)',
          'write(all)',
        ],
        'auth.oauth.scopeDelimiter': 'scopeDelimiter',
        'auth.oauth.accessTokenPath': 'oauth.accessTokenPath',
        'auth.oauth.grantType': 'oauth.grantType',
        'auth.oauth.clientCredentialsLocation': 'oauth.clientCredentialsLocation',
        'auth.oauth.accessTokenBody': 'oauth.accessTokenBody',
        'auth.oauth.accessTokenHeaders': 'oauth.accessTokenHeaders',
        'auth.oauth.username': 'oauth.username',
        'auth.oauth.password_crypt': 'oauth.password_crypt',
        'auth.oauth.password_salt': 'oauth.password_salt',
        'auth.oauth.password': 'oauth.password', // For test cases
        'auth.token.token_crypt': 'bearerToken_crypt',
        'auth.token.token_salt': 'bearerToken_salt',
        'auth.token.token': 'bearerToken', // For test cases
        'auth.token.headerName': 'authHeader',
        'auth.token.scheme': 'authScheme',
        'auth.token.location': 'tokenLocation',
        'auth.token.paramName': 'tokenParam',
        'auth.token.refreshMethod': 'refreshTokenMethod',
        'auth.token.refreshMediaType': 'refreshTokenMediaType',
        'auth.token.refreshRelativeURI': 'refreshTokenURI',
        'auth.token.refreshBody': 'refreshTokenBody',
        'auth.token.refreshTokenPath': 'refreshTokenPath',
        'auth.token.refreshHeaders': 'refreshTokenHeaders',
        'auth.token.refreshToken_crypt': 'refreshToken_crypt',
        'auth.token.refreshToken_salt': 'refreshToken_salt',
        'auth.token.refreshToken': 'refreshToken', // For test cases
        'auth.cookie.uri': 'cookieAuth.uri',
        'auth.cookie.body': 'cookieAuth.body',
        'auth.cookie.method': 'cookieAuth.method',
        'auth.cookie.successStatusCode': 'cookieAuth.successStatusCode',
      },
    };
    const restData = {
      _id: 'conn_id',
      assistant: 'test',
      name: 'test connection name',
      rest: {
        _httpConnectorId: '_httpConnectorId',
        _httpConnectorVersionId: '_httpConnectorVersionId',
        _iClientId: '_iClientId',
        authHeader: 'authHeader',
        authScheme: 'authScheme',
        authType: 'authType',
        authURI: 'authURI',
        baseURI: 'baseURI',
        basicAuth: {
          password: 'basicAuth.password',
          password_crypt: 'basicAuth.password_crypt',
          password_salt: 'basicAuth.password_salt',
          username: 'basicAuth.username',
        },
        bearerToken: 'bearerToken',
        bearerToken_crypt: 'bearerToken_crypt',
        bearerToken_salt: 'bearerToken_salt',
        concurrencyLevel: 'concurrencyLevel',
        cookieAuth: {
          body: 'cookieAuth.body',
          method: 'cookieAuth.method',
          successStatusCode: 'cookieAuth.successStatusCode',
          uri: 'cookieAuth.uri',
        },
        disableStrictSSL: 'disableStrictSSL',
        encrypted: 'encrypted',
        encryptedFields: 'encryptedFields',
        encrypted_crypt: 'encrypted_crypt',
        encrypted_salt: 'encrypted_salt',
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
          {
            name: 'user-name',
            value: '{{{connection.rest.unencrypted.username}}}',
          },
          {
            name: 'password',
            value: '{{{connection.rest.encrypted.password}}}',
          },
          {
            name: 'basic-auth',
            value: '{{{connection.rest.basicAuth}}}',
          },
          {
            name: 'refreshToken',
            value: '{{{connection.rest.refreshToken}}}',
          },
          {
            name: 'token',
            value: '{{{connection.rest.bearerToken}}}',
          },
          {
            name: 'scope',
            value: '{{{connection.rest.scope}}}',
          },
          {
            name: 'version',
            value: '{{{connection.rest.unencrypted.version}}}',
          },
        ],
        mediaType: 'mediaType',
        oauth: {
          accessTokenBody: 'oauth.accessTokenBody',
          accessTokenHeaders: 'oauth.accessTokenHeaders',
          accessTokenPath: 'oauth.accessTokenPath',
          clientCredentialsLocation: 'oauth.clientCredentialsLocation',
          grantType: 'oauth.grantType',
          password: 'oauth.password',
          password_crypt: 'oauth.password_crypt',
          password_salt: 'oauth.password_salt',
          useIClientFields: 'oauth.useIClientFields',
          username: 'oauth.username',
        },
        oauthTokenURI: 'oauthTokenURI',
        pingBody: 'pingBody',
        pingFailurePath: 'pingFailurePath',
        pingFailureValues: 'pingFailureValues',
        pingMethod: 'pingMethod',
        pingRelativeURI: 'pingRelativeURI',
        pingSuccessPath: 'pingSuccessPath',
        pingSuccessValues: 'pingSuccessValues',
        refreshToken: 'refreshToken',
        refreshTokenBody: 'refreshTokenBody',
        refreshTokenHeaders: 'refreshTokenHeaders',
        refreshTokenMediaType: 'refreshTokenMediaType',
        refreshTokenMethod: 'refreshTokenMethod',
        refreshTokenPath: 'refreshTokenPath',
        refreshTokenURI: 'refreshTokenURI',
        refreshToken_crypt: 'refreshToken_crypt',
        refreshToken_salt: 'refreshToken_salt',
        retryHeader: 'retryHeader',
        scope: [
          'read(all)',
          'write(all)',
        ],
        scopeDelimiter: 'scopeDelimiter',
        tokenLocation: 'tokenLocation',
        tokenParam: 'tokenParam',
        unencrypted: 'unencrypted',
      },
      type: 'rest',
    };

    const httpToRest = convertConnJSONObjHTTPtoREST(httpData);

    expect(httpToRest).toEqual(restData);
  });
  test('should test HTTP to REST connection conversion of magento assistant', () => {
    const httpData = {
      _id: '61acee7e3b2658159b556788',
      createdAt: '2021-12-05T16:53:18.521Z',
      lastModified: '2021-12-08T13:18:18.770Z',
      type: 'http',
      name: 'Magento2 Connection',
      assistant: 'magento',
      offline: true,
      debugDate: '2019-11-15T07:35:07.795Z',
      sandbox: false,
      http: {
        formType: 'assistant',
        mediaType: 'json',
        baseURI: 'http://34.192.23.238/community228/rest',
        ping: {
          successValues: [],
          failValues: [],
          relativeURI: '/V1/modules',
          method: 'GET',
        },
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        unencrypted: {
          username: 'ioteam',
        },
        encrypted: '******',
        encryptedFields: [],
        auth: {
          type: 'token',
          oauth: {
            scope: [],
          },
          token: {
            token: '******',
            location: 'header',
            headerName: 'Authorization',
            scheme: 'Bearer',
            refreshMethod: 'POST',
            refreshRelativeURI: 'http://34.192.23.238/community228/rest/V1/integration/admin/token',
            refreshBody: '{"username":"{{{connection.http.unencrypted.username}}}", "password":"{{{connection.http.encrypted.password}}}"}',
            refreshMediaType: 'json',
            refreshHeaders: [
              {
                name: 'Content-Type',
                value: 'application/json',
              },
            ],
          },
        },
      },
    };
    const restData = {
      _id: '61acee7e3b2658159b556788',
      assistant: 'magento',
      createdAt: '2021-12-05T16:53:18.521Z',
      debugDate: '2019-11-15T07:35:07.795Z',
      lastModified: '2021-12-08T13:18:18.770Z',
      name: 'Magento2 Connection',
      offline: true,
      rest: {
        authHeader: 'Authorization',
        authScheme: 'Bearer',
        authType: 'token',
        baseURI: 'http://34.192.23.238/community228/rest',
        basicAuth: {
          username: 'ioteam',
        },
        bearerToken: '******',
        encrypted: '******',
        encryptedFields: [

        ],
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        mediaType: 'json',
        pingFailureValues: [

        ],
        pingMethod: 'GET',
        pingRelativeURI: '/V1/modules',
        pingSuccessValues: [

        ],
        refreshTokenBody: '{"username":"{{{connection.rest.basicAuth.username}}}", "password":"{{{connection.rest.encrypted.password}}}"}',
        refreshTokenHeaders: [
          {
            name: 'Content-Type',
            value: 'application/json',
          },
        ],
        refreshTokenMediaType: 'json',
        refreshTokenMethod: 'POST',
        refreshTokenURI: 'http://34.192.23.238/community228/rest/V1/integration/admin/token',
        scope: [

        ],
        tokenLocation: 'header',
        unencrypted: {
          username: 'ioteam',
        },
      },
      sandbox: false,
      type: 'rest',
    };

    const httpToRest = convertConnJSONObjHTTPtoREST(httpData);

    expect(httpToRest).toEqual(restData);
  });
});
