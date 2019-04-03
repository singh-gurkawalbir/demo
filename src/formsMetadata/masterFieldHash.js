export default {
  'connection.name': {
    name: '/name',
    type: 'text',
    label: 'Name',
    required: true,
  },
  'connection.http.baseURI': {
    name: '/http/baseURI',
    type: 'text',
    label: 'Base URI',
    required: true,
  },
  mediaType: {
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
    name: '/http/auth/type',
    helpKey: 'connection.http.auth.type',
    defaultValue: r => r.http.auth.type,
    type: 'select',
    label: 'Authentication Type',
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
    name: '/http/auth/failStatusCode',
    helpKey: 'connection.http.auth.failStatusCode',
    defaultValue: r => r.http.auth.failStatusCode,
    type: 'text',
    label: 'Authentication Fail Status Code',
    placeholder: 'optional',
  },
  AuthenticationFailPath: {
    name: '/http/auth/failPath',
    helpKey: 'connection.http.auth.failPath',
    defaultValue: r => r.http.auth.failPath,
    type: 'text',
    label: 'Authentication Fail Path',
    placeholder: 'optional',
  },
  AuthenticationFailValues: {
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
    name: '/http/ping/relativeURI',
    helpKey: 'connection.http.ping.relativeURI',
    defaultValue: r => r.http.ping.relativeURI,
    connectionId: r => r._id,
    type: 'relativeuri',
    label: 'Relative URI',
    placeholder: 'optional',
  },
  PingMethod: {
    name: '/http/ping/method',
    helpKey: 'connection.http.ping.method',
    defaultValue: r => r.http.ping.method,
    type: 'select',
    label: 'Ping Method',
    options: [
      {
        items: ['GET', 'PUT', 'POST'],
      },
    ],
  },
  PingSuccessPath: {
    name: '/http/ping/successPath',
    helpKey: 'connection.http.ping.successPath',
    defaultValue: r => r.http.ping.successPath,
    type: 'text',
    label: 'Success Path',
    placeholder: 'optional',
  },
  PingSuccessValues: {
    name: '/http/ping/successValues',
    helpKey: 'connection.http.ping.successValues',
    defaultValue: r => r.http.ping.successValues,
    valueDelimiter: ',',
    type: 'text',
    label: 'Success Values',
    placeholder: 'optional',
  },
  PingErrorPath: {
    name: '/http/ping/errorPath',
    helpKey: 'connection.http.ping.errorPath',
    defaultValue: r => r.http.ping.errorPath,
    type: 'text',
    label: 'Error Path',
    placeholder: 'optional',
  },
  Limit: {
    name: '/http/rateLimit/limit',
    helpKey: 'connection.http.rateLimit.limit',
    defaultValue: r => r.http && r.http.rateLimit && r.http.rateLimit.limit,
    type: 'text',
    label: 'Limit',
    placeholder: 'optional',
  },
  LimitStatusCode: {
    name: '/http/rateLimit/failStatusCode',
    helpKey: 'connection.http.rateLimit.failStatusCode',
    defaultValue: r =>
      r.http && r.http.rateLimit && r.http.rateLimit.failStatusCode,
    type: 'text',
    label: 'Fail Status Code',
    placeholder: 'optional',
  },
  RateLimitFailPath: {
    name: '/http/rateLimit/failPath',
    helpKey: 'connection.http.rateLimit.failPath',
    defaultValue: r => r.http && r.http.rateLimit && r.http.rateLimit.failPath,
    type: 'text',
    label: 'Fail Path',
    placeholder: 'optional',
  },
  RateLimitFailValues: {
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
    name: '/http/rateLimit/retryHeader',
    helpKey: 'connection.http.rateLimit.retryHeader',
    defaultValue: r =>
      r.http && r.http.rateLimit && r.http.rateLimit.retryHeader,
    type: 'text',
    label: 'Retry Header',
    placeholder: 'optional',
  },
  RefreshToken: {
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
    name: '/http/disableStrictSSL',
    helpKey: 'connection.http.disableStrictSSL',
    defaultValue: r => r.http.disableStrictSSL,
    type: 'checkbox',
    label: 'Disable Strict SSL',
  },
  BorrowConcurrencyFrom: {
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
    name: '/file/csv',
    type: 'csvparse',
    helpText: 'Use this editor to preview how your parse options affect your ',
    label: 'Configure CSV parse options',
    defaultValue: r => r.file && r.file.csv,
    sampleData: r => r.sampleData,
  },

  ExportName: {
    name: '/name',
    helpKey: 'export.name',
    defaultValue: r => r.name,
    type: 'text',
    label: 'Name',
  },
  ExportDescription: {
    name: '/description',
    helpKey: 'export.description',
    defaultValue: r => r.description,
    type: 'text',
    multiline: true,
    rowsMax: 4,
    label: 'Description',
  },
  ExportHttpMethod: {
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
    name: '/http/relativeURI',
    helpKey: 'export.http.relativeURI',
    defaultValue: r => r.http.relativeURI,
    connectionId: r => r._connectionId,
    type: 'relativeuri',
    label: 'Relative URI',
    required: true,
  },
  ExportHttpBody: {
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
    name: '/name',
    helpKey: 'import.name',
    defaultValue: r => r.name,
    type: 'text',
    label: 'Name',
  },
  'import.description': {
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
