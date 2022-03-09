import { API } from '../utils';

export default API.get('/api/connections',
  [
    {
      _id: '5e7068331c056a75e6df19b2',
      createdAt: '2020-03-17T06:03:31.798Z',
      lastModified: '2020-03-19T23:47:55.181Z',
      type: 'rest',
      name: '3D Cart Staging delete',
      assistant: '3dcart',
      offline: true,
      sandbox: false,
      isHTTP: true,
      http: {
        formType: 'assistant',
        mediaType: 'json',
        baseURI: 'https://apirest.3dcart.com',
        concurrencyLevel: 11,
        ping: {
          relativeURI: '/3dCartWebAPI/v1/Customers',
          method: 'GET',
        },
        headers: [
          {
            name: 'SecureUrl',
            value: 'https://celigoc1.com',
          },
          {
            name: 'PrivateKey',
            value: '{{{connection.http.encrypted.PrivateKey}}}',
          },
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
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
            headerName: 'Token',
            scheme: ' ',
            refreshMethod: 'POST',
            refreshMediaType: 'urlencoded',
          },
        },
      },
      rest: {
        baseURI: 'https://apirest.3dcart.com',
        bearerToken: '******',
        tokenLocation: 'header',
        mediaType: 'json',
        authType: 'token',
        authHeader: 'Token',
        authScheme: ' ',
        headers: [
          {
            name: 'SecureUrl',
            value: 'https://celigoc1.com',
          },
          {
            name: 'PrivateKey',
            value: '{{{connection.rest.encrypted.PrivateKey}}}',
          },
        ],
        encrypted: '******',
        encryptedFields: [],
        unencryptedFields: [],
        scope: [],
        pingRelativeURI: '/3dCartWebAPI/v1/Customers',
        concurrencyLevel: 11,
        refreshTokenHeaders: [],
      },
    },
    {
      _id: '5e2557e8305adc5f80b6910e',
      createdAt: '2020-01-20T07:34:00.566Z',
      lastModified: '2020-01-23T00:33:08.959Z',
      type: 'rest',
      name: '3dcart',
      assistant: '3dcart',
      offline: true,
      sandbox: false,
      isHTTP: false,
      http: {
        formType: 'assistant',
        mediaType: 'json',
        baseURI: 'https://apirest.3dcart.com',
        ping: {
          relativeURI: '/3dCartWebAPI/v1/Customers',
          method: 'GET',
        },
        headers: [
          {
            name: 'SecureUrl',
            value: 'https://sandbox-integrator-io.3dcartstores.com',
          },
          {
            name: 'PrivateKey',
            value: '{{{connection.http.encrypted.PrivateKey}}}',
          },
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
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
            headerName: 'Token',
            scheme: ' ',
            refreshMethod: 'POST',
            refreshMediaType: 'urlencoded',
            refreshHeaders: [],
          },
        },
      },
      rest: {
        baseURI: 'https://apirest.3dcart.com',
        bearerToken: '******',
        tokenLocation: 'header',
        mediaType: 'json',
        authType: 'token',
        authHeader: 'Token',
        authScheme: ' ',
        headers: [
          {
            name: 'SecureUrl',
            value: 'https://sandbox-integrator-io.3dcartstores.com',
          },
          {
            name: 'PrivateKey',
            value: '{{{connection.rest.encrypted.PrivateKey}}}',
          },
        ],
        encrypted: '******',
        encryptedFields: [],
        unencryptedFields: [],
        scope: [],
        pingRelativeURI: '/3dCartWebAPI/v1/Customers',
        refreshTokenHeaders: [],
      },
    },
    {
      _id: '5ed8c613f1188372591a3236',
      createdAt: '2020-06-04T09:59:47.174Z',
      lastModified: '2020-06-08T05:23:45.351Z',
      type: 'http',
      name: '4cast plus',
      assistant: '4castplus',
      sandbox: false,
      http: {
        formType: 'assistant',
        mediaType: 'json',
        baseURI: 'https://blue.4castplus.com',
        ping: {
          relativeURI: '/api/customers',
          method: 'GET',
          failValues: [],
          successValues: [],
        },
        rateLimit: {
          failValues: [],
        },
        unencrypted: {
          username: 'jbono@questco.com',
        },
        encrypted: '******',
        auth: {
          type: 'token',
          failValues: [],
          oauth: {
            scope: [],
          },
          token: {
            token: '******',
            location: 'url',
            paramName: '_s',
            refreshMethod: 'POST',
            refreshRelativeURI: 'https://blue.4castplus.com/api/login',
            refreshBody: '{ "UserName":"{{{connection.http.unencrypted.username}}}","Password":"{{{connection.http.encrypted.password}}}"}',
            refreshMediaType: 'json',
            refreshTokenPath: 'SessionId',
          },
        },
      },
    },
    {
      _id: '61949f397811ca183c4612fc',
      createdAt: '2021-11-17T06:20:41.139Z',
      lastModified: '2021-11-17T06:20:41.212Z',
      type: 'as2',
      name: 'AS2',
      sandbox: false,
      as2: {
        as2Id: 'dfdgfd',
        partnerId: 'sdfwe',
        unencrypted: {
          partnerCertificate: 'sdfd',
          userPublicKey: 'sd',
        },
        partnerStationInfo: {
          as2URI: 'http://test.io',
          mdn: {
            mdnSigning: 'NONE',
          },
          signing: 'SHA1',
          encryptionType: 'DES',
          encoding: 'base64',
          signatureEncoding: 'base64',
          auth: {
            token: {
              headerName: 'Authorization',
            },
          },
        },
        userStationInfo: {
          mdn: {
            mdnSigning: 'SHA1',
            mdnEncoding: 'base64',
          },
          signing: 'SHA1',
          encryptionType: '3DES',
          encoding: 'base64',
        },
      },
    },
    {
      _id: '5ee0b67a3c11e4201f43102d',
      createdAt: '2020-06-10T10:31:22.431Z',
      lastModified: '2020-07-08T04:32:09.756Z',
      type: 'rest',
      name: 'Acumatica Agent HTTP',
      assistant: 'acumatica',
      offline: true,
      sandbox: false,
      _agentId: '5ed8c824f1188372591a32c4',
      isHTTP: true,
      http: {
        formType: 'assistant',
        mediaType: 'json',
        baseURI: 'http://isvtest.acumatica.com/certification_celigo_19r2/entity/Default/18.200.001',
        ping: {
          relativeURI: '/FinancialPeriod',
          method: 'GET',
        },
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        unencrypted: {
          endpointName: 'Default',
          endpointVersion: '18.200.001',
          username: 'admin',
        },
        encrypted: '******',
        auth: {
          type: 'cookie',
          cookie: {
            uri: 'http://isvtest.acumatica.com/certification_celigo_19r2/entity/auth/login',
            body: '{"name": "admin","password": "Setup2","company": ""}',
            method: 'POST',
            successStatusCode: 204,
          },
        },
      },
      rest: {
        baseURI: 'http://isvtest.acumatica.com/certification_celigo_19r2/entity/Default/18.200.001',
        isHTTPProxy: false,
        mediaType: 'json',
        authType: 'cookie',
        headers: [
          {
            name: 'content-type',
            value: 'application/json',
          },
        ],
        encrypted: '******',
        encryptedFields: [],
        unencrypted: {
          endpointName: 'Default',
          endpointVersion: '18.200.001',
          username: 'admin',
        },
        unencryptedFields: [],
        scope: [],
        pingRelativeURI: '/FinancialPeriod',
        pingMethod: 'GET',
        cookieAuth: {
          uri: 'http://isvtest.acumatica.com/certification_celigo_19r2/entity/auth/login',
          body: '******',
          method: 'POST',
          successStatusCode: 204,
        },
      },
    }]);
