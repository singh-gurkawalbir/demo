export default {
  // TODO: The current set of field ids for connections is hand coded and not
  // the correct format. We should use a camel case version of the field's
  // json path.
  // #region Connection
  ConnectionName: {
    id: 'ConnectionName',
    name: '/name',
    helpKey: 'connection.name',
    defaultValue: r => r.name,
    type: 'text',
    label: 'Name',
  },
  ConnectionDescription: {
    id: 'ConnectionDescription',
    name: '/description',
    helpKey: 'connection.description',
    defaultValue: r => r.description,
    type: 'text',
    multiline: true,
    rowsMax: 5,
    label: 'Description',
  },
  baseURI: {
    id: 'ConnectionBaseURI',
    name: '/http/baseURI',
    helpKey: 'connection.http.baseURI',
    defaultValue: r => r.http.baseURI,
    type: 'text',
    label: 'Base URI',
    required: true,
  },
  mediaType: {
    id: 'ConnectionMediaType',
    name: '/http/mediaType',
    helpKey: 'connection.http.mediaType',
    defaultValue: r => r.http.mediaType,

    type: 'select',
    label: 'Media Type',
    options: [
      {
        items: [
          {
            label: 'JSON',
            value: 'json',
          },
          {
            label: 'XML',
            value: 'xml',
          },
        ],
      },
    ],
    visible: true,
    required: true,
  },
  HttpHeader: {
    id: 'ConnectionHttpHeader',
    name: '/http/headers',
    helpKey: 'connection.http.headers',
    defaultValue: r => r.http.headers,
    label: 'HTTP Headers',
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    description: 'If needed, add any custom headers this application requires.',
  },

  AuthenticationType: {
    id: 'ConnectionAuthenticationType',
    name: '/http/auth/type',
    helpKey: 'connection.http.auth.type',
    defaultValue: r => r.http.auth.type,
    type: 'select',
    label: 'Authentication Type',
    description: '',
    placeholder: '',
    options: [
      {
        items: [
          {
            label: 'Custom',
            value: 'custom',
          },
          {
            label: 'Basic',
            value: 'basic',
          },
          {
            label: 'Token',
            value: 'token',
          },
        ],
      },
    ],
    visible: true,
    required: false,
  },
  AuthFailStatusCode: {
    id: 'ConnectionAuthFailStatusCode',
    name: '/http/auth/failStatusCode',
    helpKey: 'connection.http.auth.failStatusCode',
    defaultValue: r => r.http.auth.failStatusCode,
    type: 'text',
    label: 'Authentication Fail Status Code',
    description: '',
    placeholder: 'optional',
  },
  AuthenticationFailPath: {
    id: 'ConnectionAuthenticationFailPath ',
    name: '/http/auth/failPath',
    helpKey: 'connection.http.auth.failPath',
    defaultValue: r => r.http.auth.failPath,
    type: 'text',
    label: 'Authentication Fail Path',
    description: '',
    placeholder: 'optional',
  },
  AuthenticationFailValues: {
    id: 'ConnectionAuthenticationFailValues',
    name: '/http/auth/failValues',
    helpKey: 'connection.http.auth.failValues',
    defaultValue: r => r.http.auth.failValues,
    valueDelimiter: ',',
    type: 'text',
    label: 'Authentication Fail Values',
    description: 'Separate multiple values with commas.',
    placeholder: 'optional',
  },
  Unencrypted: {
    id: 'ConnectionUnencrypted',
    name: '/http/unencrypted',
    helpKey: 'connection.http.unencrypted',
    defaultValue: r => r.http.unencrypted,
    type: 'editor',
    mode: 'json',
    label: 'Unencrypted',
    description: 'Place any non-sesitive custom connection information here.',
    placeholder: '{"field": "value"}',
  },
  Encrypted: {
    id: 'ConnectionEncrypted',
    name: '/http/encrypted',
    helpKey: 'connection.http.encrypted',
    defaultValue: r => r.http.encrypted,
    type: 'editor',
    mode: 'json',
    label: 'Encrypted',
    description: 'Place your sesitive custom connetion information here.',
    placeholder: '{"field": "value"}',
  },

  PingRelativeURI: {
    id: 'ConnectionPingRelativeURI',
    name: '/http/ping/relativeURI',
    helpKey: 'connection.http.ping.relativeURI',
    defaultValue: r => r.http.ping.relativeURI,
    connectionId: r => r._id,
    type: 'relativeuri',
    label: 'Relative URI',
    description: '',
    placeholder: 'optional',
  },
  PingMethod: {
    id: 'ConnectionPingMethod',
    name: '/http/ping/method',
    helpKey: 'connection.http.ping.method',
    defaultValue: r => r.http.ping.method,
    type: 'select',
    label: 'Ping Method',
    description: '',
    options: [
      {
        items: ['GET', 'PUT', 'POST'],
      },
    ],
  },
  PingSuccessPath: {
    id: 'ConnectionPingSuccessPath',
    name: '/http/ping/successPath',
    helpKey: 'connection.http.ping.successPath',
    defaultValue: r => r.http.ping.successPath,
    type: 'text',
    label: 'Success Path',
    description: '',
    placeholder: 'optional',
  },
  PingSuccessValues: {
    id: 'ConnectionPingSuccessValues',
    name: '/http/ping/successValues',
    helpKey: 'connection.http.ping.successValues',
    defaultValue: r => r.http.ping.successValues,
    valueDelimiter: ',',
    type: 'text',
    label: 'Success Values',
    description: '',
    placeholder: 'optional',
  },
  PingErrorPath: {
    id: 'ConnectionPingErrorPath',
    name: '/http/ping/errorPath',
    helpKey: 'connection.http.ping.errorPath',
    defaultValue: r => r.http.ping.errorPath,
    type: 'text',
    label: 'Error Path',
    description: '',
    placeholder: 'optional',
  },
  Limit: {
    id: 'ConnectionLimit',
    name: '/http/rateLimit/limit',
    helpKey: 'connection.http.rateLimit.limit',
    defaultValue: r => r.http && r.http.rateLimit && r.http.rateLimit.limit,
    type: 'text',
    label: 'Limit',
    placeholder: 'optional',
  },
  LimitStatusCode: {
    id: 'ConnectionLimitStatusCode',
    name: '/http/rateLimit/failStatusCode',
    helpKey: 'connection.http.rateLimit.failStatusCode',
    defaultValue: r =>
      r.http && r.http.rateLimit && r.http.rateLimit.failStatusCode,
    type: 'text',
    label: 'Fail Status Code',
    placeholder: 'optional',
  },
  RateLimitFailPath: {
    id: 'ConnectionRateLimitFailPath',
    name: '/http/rateLimit/failPath',
    helpKey: 'connection.http.rateLimit.failPath',
    defaultValue: r => r.http && r.http.rateLimit && r.http.rateLimit.failPath,
    type: 'text',
    label: 'Fail Path',
    placeholder: 'optional',
  },
  RateLimitFailValues: {
    id: 'ConnectionRateLimitFailValues',
    name: '/http/rateLimit/failValues',
    helpKey: 'connection.http.rateLimit.failValues',
    defaultValue: r =>
      r.http && r.http.rateLimit && r.http.rateLimit.failValues,
    valueDelimiter: ',',
    type: 'text',
    label: 'Fail Values',
    placeholder: 'optional',
  },
  LimitRetryHeader: {
    id: 'ConnectionLimitRetryHeader',
    name: '/http/rateLimit/retryHeader',
    helpKey: 'connection.http.rateLimit.retryHeader',
    defaultValue: r =>
      r.http && r.http.rateLimit && r.http.rateLimit.retryHeader,
    type: 'text',
    label: 'Retry Header',
    placeholder: 'optional',
  },
  RefreshToken: {
    id: 'ConnectionRefreshToken',
    name: '/http/auth/token/refreshToken',
    helpKey: 'connection.http.auth.token.refreshToken',
    defaultValue: r =>
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshToken,
    type: 'text',
    label: 'Refresh Token',
  },
  RefreshRelativeURI: {
    id: 'ConnectionRefreshRelativeURI',
    name: '/http/auth/token/refreshRelativeURI',
    helpKey: 'connection.http.auth.token.refreshRelativeURI',
    defaultValue: r =>
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshRelativeURI,
    connectionId: r => r._id,
    type: 'relativeuri',
    label: 'Relative URI',
  },
  RefreshMediaType: {
    id: 'ConnectionRefreshMediaType',
    name: '/http/auth/token/refreshMediaType',
    helpKey: 'connection.http.auth.token.refreshMediaType',
    defaultValue: r =>
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshMediaType,
    type: 'select',
    options: [
      {
        items: ['XML', 'JSON'],
      },
    ],
    label: 'Media type',
  },
  RefreshMethod: {
    id: 'ConnectionRefreshMethod',
    name: '/http/auth/token/refreshMethod',
    helpKey: 'connection.http.auth.token.refreshMethod',
    defaultValue: r =>
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshMethod,
    type: 'select',
    options: [
      {
        items: ['GET', 'PUT', 'POST'],
      },
    ],
    label: 'HTTP method',
  },
  RefreshBody: {
    id: 'ConnectionRefreshBody',
    name: '/http/auth/token/refreshBody',
    helpKey: 'connection.http.auth.token.refreshBody',
    defaultValue: r =>
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshBody,
    type: 'editor',
    mode: '{{http.auth.token.refreshMethod}}',
    label: 'HTTP body',
  },
  RefreshTokenPath: {
    id: 'ConnectionRefreshTokenPath',
    name: '/http/auth/token/refreshTokenPath',
    helpKey: 'connection.http.auth.token.refreshTokenPath',
    defaultValue: r =>
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshTokenPath,
    type: 'text',
    label: 'Token Path',
  },
  DisableStrictSSL: {
    id: 'ConnectionDisableStrictSSL',
    name: '/http/disableStrictSSL',
    helpKey: 'connection.http.disableStrictSSL',
    defaultValue: r => r.http.disableStrictSSL,
    type: 'checkbox',
    label: 'Disable Strict SSL',
  },
  BorrowConcurrencyFrom: {
    id: 'ConnectionBorrowConcurrencyFrom',
    name: '/_borrowConcurrencyFromConnectionId',
    helpKey: 'connection._borrowConcurrencyFromConnectionId',
    resourceType: 'connections',
    defaultValue: r => r._borrowConcurrencyFromConnectionId,
    filter: r => ({ type: r.type }),
    excludeFilter: r => ({ _id: r._id }),
    type: 'selectresource',
    label: 'Borrow Concurrency From',
  },
  ConcurrencyLevel: {
    id: 'ConnectionConcurrencyLevel',
    name: '/http/concurrencyLevel',
    helpKey: 'connection.http.concurrencyLevel',
    defaultValue: r => r.http.concurrencyLevel,
    type: 'select',
    options: [
      {
        items: [
          { label: ' ', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
          { label: '6', value: 6 },
          { label: '7', value: 7 },
          { label: '8', value: 8 },
          { label: '9', value: 9 },
          { label: '10', value: 10 },
          { label: '11', value: 11 },
          { label: '12', value: 12 },
          { label: '13', value: 13 },
          { label: '14', value: 14 },
          { label: '15', value: 15 },
          { label: '16', value: 16 },
          { label: '17', value: 17 },
          { label: '18', value: 18 },
          { label: '19', value: 19 },
          { label: '20', value: 20 },
          { label: '21', value: 21 },
          { label: '22', value: 22 },
          { label: '23', value: 23 },
          { label: '24', value: 24 },
          { label: '25', value: 25 },
        ],
      },
    ],
    label: 'Concurrency Level',
  },
  // #endregion Connection

  // #region Export
  'export.file.csv': {
    id: 'export.file.csv',
    name: '/file/csv',
    type: 'csvparse',
    helpText: 'Use this editor to preview how your parse options affect your ',
    label: 'Configure CSV parse options',
    defaultValue: r => r.file && r.file.csv,
    sampleData: r => r.sampleData,
  },

  ExportName: {
    id: 'ExportName',
    name: '/name',
    helpKey: 'export.name',
    defaultValue: r => r.name,
    type: 'text',
    label: 'Name',
  },
  ExportDescription: {
    id: 'ExportDescription',
    name: '/description',
    helpKey: 'export.description',
    defaultValue: r => r.description,
    type: 'text',
    multiline: true,
    rowsMax: 4,
    label: 'Description',
  },
  ExportHttpMethod: {
    id: 'ExportHttpMethod',
    name: '/http/method',
    helpKey: 'export.http.method',
    defaultValue: r => r.http.method,
    type: 'select',
    label: 'HTTP method',
    options: [
      {
        items: ['GET', 'POST'],
      },
    ],
  },
  ExportHttpRelativeURI: {
    id: 'ExportHttpRelativeURI',
    name: '/http/relativeURI',
    helpKey: 'export.http.relativeURI',
    defaultValue: r => r.http.relativeURI,
    connectionId: r => r._connectionId,
    type: 'relativeuri',
    label: 'Relative URI',
    required: true,
  },
  ExportHttpBody: {
    id: 'ExportHttpBody',
    name: '/http/body',
    helpKey: 'export.http.body',
    defaultValue: r => r.http.body,
    type: 'editor',
    mode: 'json',
    label: 'HTTP Body',
  },
  // #endregion Export

  // #region Import
  'import.name': {
    id: 'import.name',
    name: '/name',
    helpKey: 'import.name',
    defaultValue: r => r.name,
    type: 'text',
    label: 'Name',
  },
  'import.description': {
    id: 'import.description',
    name: '/description',
    helpKey: 'import.description',
    defaultValue: r => r.description,
    type: 'text',
    multiline: true,
    rowsMax: 4,
    label: 'Description',
  },
  // #endregion Import
};
