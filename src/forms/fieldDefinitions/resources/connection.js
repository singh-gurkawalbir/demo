import { URI_VALIDATION_PATTERN, RDBMS_TYPES} from '../../../utils/constants';
import { isNewId, getDomainUrl } from '../../../utils/resource';
import { applicationsList } from '../../../constants/applications';

export default {
  // #region common
  // TODO: develop code for this two components
  // agent list handleBars evaluated its a dynamicList
  _borrowConcurrencyFromConnectionId: {
    resourceType: 'connections',
    filter: r => {
      const expression = [
        { _id: { $ne: r._id } },
      ];

      if (RDBMS_TYPES.includes(r.type)) {
        expression.push({ 'rdbms.type': r.type });
      } else {
        // Should not borrow concurrency for ['ftp', 'as2', 's3']
        expression.push({ type: ['ftp', 'as2', 's3'].includes(r.type) ? '' : r.type });
        if (r.assistant) {
          expression.push({ assistant: r.assistant });
        }

        if (r.type === 'netsuite') {
          expression.push({
            'netsuite.account': r?.netsuite?.account,
            'netsuite.environment': r?.netsuite?.environment,
          });
        }
      }

      return {
        $and: expression,
      };
    },
    type: 'selectresource',
    label: 'Borrow concurrency from',
  },
  _agentId: {
    type: 'selectresource',
    label: 'Agent',
    resourceType: 'agents',
  },
  uploadFile: {
    type: 'uploadfile',
    label: 'Sample file (that would be exported)',
    resourceType: 'connections',
  },
  scope: {
    type: 'selectscopes',
    label: 'Configure scopes',
  },
  name: {
    type: 'text',
    label: 'Name',
    defaultDisabled: r => !!r._connectorId && !isNewId(r._id),
    required: true,
  },
  application: {
    id: 'application',
    type: 'text',
    label: 'Application',
    defaultValue: r => {
      const isNew = isNewId(r._id);

      if (isNew && r.application) {
        return r.application;
      }
      const applications = applicationsList();
      const application = r.assistant || (r.type === 'rdbms' ? r.rdbms.type : r.type);
      const app = applications.find(a => a.id === application) || {};

      return app.name;
    },
    defaultDisabled: true,
  },
  // #endregion common
  // #region rdbms
  'rdbms.host': {
    type: 'text',
    label: 'Host',
    required: true,
  },
  'rdbms.port': {
    type: 'text',
    label: 'Port',
    validWhen: [
      {
        fallsWithinNumericalRange: {
          min: 0,
          max: 65535,
          message: 'The value must be more than 0 and less than 65535',
        },
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rdbms.database': {
    type: 'text',
    label: 'Database name',
    required: true,
  },
  'rdbms.instanceName': {
    type: 'text',
    label: 'Instance name',
    visibleWhen: [{ field: 'type', is: ['mssql'] }],
  },
  'rdbms.user': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'rdbms.password': {
    type: 'text',
    label: 'Password',
    required: true,
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'rdbms.ssl.ca': {
    type: 'editor',
    mode: 'text',
    label: 'Certificate authority',
  },
  'rdbms.ssl.key': {
    type: 'editor',
    mode: 'text',
    label: 'Key',
  },
  'rdbms.ssl.passphrase': {
    type: 'text',
    label: 'Passphrase',
  },
  'rdbms.ssl.cert': {
    type: 'editor',
    mode: 'text',
    label: 'Certificate',
  },
  'rdbms.version': {
    type: 'select',
    label: 'SQL server version',
    required: true,
    visibleWhen: [{ field: 'type', is: ['mssql'] }],
    options: [
      {
        items: [
          { label: 'SQL Server 2008 R2 (Not supported by Microsoft)', value: 'SQL Server 2008 R2' },
          { label: 'SQL Server 2012', value: 'SQL Server 2012' },
          { label: 'SQL Server 2014', value: 'SQL Server 2014' },
          { label: 'SQL Server 2016', value: 'SQL Server 2016' },
          { label: 'SQL Server 2017', value: 'SQL Server 2017' },
          { label: 'Azure', value: 'Azure' },
        ],
      },
    ],
  },
  'rdbms.options': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Configure properties',
  },
  'rdbms.concurrencyLevel': {
    label: 'Concurrency level',
    type: 'select',
    options: [
      {
        items: [
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
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
  },
  // #endregion rdbms
  // #region rest
  'rest.mediaType': {
    type: 'select',
    label: 'Media type',
    options: [
      {
        items: [
          { label: 'JSON', value: 'json' },
          { label: 'URL Encoded', value: 'urlencoded' },
          { label: 'CSV', value: 'csv' },
        ],
      },
    ],
    defaultValue: r =>
      r && r.rest && r.rest.mediaType ? r.rest.mediaType : 'json',
  },
  'rest.baseURI': {
    type: 'text',
    label: 'Base URI',
    required: true,
  },
  'rest.bearerToken': {
    type: 'text',
    label: 'Token',
    inputType: 'password',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'rest.tokenLocation': {
    type: 'select',
    label: 'Location',
    options: [
      {
        items: [
          { label: 'Header', value: 'header' },
          { label: 'URL Parameter', value: 'url' },
        ],
      },
    ],
  },
  'rest.tokenParam': {
    type: 'text',
    label: 'REST token param',
  },
  'rest.scope': {
    type: 'selectscopes',
    label: 'Configure scopes',
  },
  'rest.scopeDelimiter': {
    type: 'text',
    label: 'REST scope delimiter',
  },
  'rest.refreshToken': {
    type: 'text',
    label: 'REST refresh token',
  },
  'rest.oauthTokenURI': {
    type: 'text',
    label: 'REST oauth token URI',
  },
  'rest.disableStrictSSL': {
    type: 'checkbox',
    label: 'Disable strict SSL',
  },
  'rest.authType': {
    type: 'select',
    label: 'Authentication type',
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
          { label: 'Custom', value: 'custom' },
          { label: 'Cookie', value: 'cookie' },
        ],
      },
    ],
  },
  'rest.authURI': {
    type: 'text',
    label: 'REST auth URI',
  },
  'rest.authHeader': {
    type: 'text',
    label: 'Header name',
    defaultValue: r => (r && r.rest && r.rest.authHeader) || 'Authorization',
  },
  'rest.retryHeader': {
    type: 'text',
    label: 'REST retry header',
  },
  'rest.authScheme': {
    type: 'select',
    label: 'Scheme',
    defaultValue: r =>
      r && r.rest && r.rest.authScheme ? r.rest.authScheme : 'Bearer',
    options: [
      {
        items: [
          { label: 'MAC', value: 'MAC' },
          { label: 'OAuth 2.0', value: 'OAuth' },
          { label: 'Bearer', value: 'Bearer' },
          // { label: 'Hmac', value: 'Hmac' },
          { label: 'None', value: ' ' },
        ],
      },
    ],
  },
  'rest.basicAuth.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'rest.basicAuth.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    description:
      'Note: for security reasons this field must always be re-entered.',
    required: true,
    defaultValue: '',
  },
  'rest.cookieAuth.uri': {
    type: 'text',
    label: 'Cookie URI',
  },
  'rest.cookieAuth.body': {
    type: 'text',
    label: 'Cookie body',
  },
  'rest.cookieAuth.method': {
    type: 'select',
    label: 'Cookie method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'rest.cookieAuth.successStatusCode': {
    type: 'text',
    label: 'Cookie success status code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'rest.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Configure HTTP headers',
  },
  'rest.encrypted': {
    type: 'editor',
    label: 'Encrypted',
    mode: 'json',
  },
  'rest.unencrypted': {
    type: 'editor',
    label: 'Unencrypted',
    mode: 'json',
  },
  'rest.oauth.accessTokenPath': {
    type: 'text',
    label: 'REST oauth access token path',
  },
  'rest.oauth.grantType': {
    type: 'radiogroup',
    label: 'REST oauth grant type',
    options: [
      {
        items: [
          { label: 'Authorizecode', value: 'authorizecode' },
          { label: 'Password', value: 'password' },
        ],
      },
    ],
  },
  'rest.oauth.username': {
    type: 'text',
    label: 'REST oauth username',
  },
  'rest.oauth.password': {
    type: 'text',
    inputType: 'password',
    label: 'REST oauth password',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'rest.refreshTokenMethod': {
    type: 'select',
    label: 'Refresh token method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
    ],
  },
  'rest.refreshTokenBody': {
    type: 'text',
    label: 'Refresh body',
  },
  'rest.refreshTokenURI': {
    type: 'text',
    label: 'REST refresh token URI',
  },
  'rest.refreshTokenPath': {
    type: 'text',
    label: 'Refresh token path',
  },
  'rest.refreshTokenMediaType': {
    type: 'select',
    label: 'Refresh token media type',
    defaultValue: r => (r && r.rest && r.rest.refreshTokenMediaType) || 'json',
    options: [
      {
        items: [
          { label: 'JSON', value: 'json' },
          { label: 'URL Encoded', value: 'urlencoded' },
        ],
      },
    ],
  },
  'rest.refreshTokenHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Refresh token headers',
  },
  'rest.info': {
    type: 'text',
    label: 'REST info',
  },
  'rest.pingRelativeURI': {
    type: 'text',
    label: 'Ping URI',
    required: true,
  },
  'rest.pingSuccessPath': {
    type: 'text',
    label: 'Ping success path',
  },
  'rest.pingSuccessValues': {
    type: 'text',
    delimiter: ',',
    label: 'Ping success values',
  },
  'rest.pingFailurePath': {
    type: 'text',
    label: 'REST ping failure path',
  },
  'rest.pingFailureValues': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'REST ping failure values',
  },
  'rest.concurrencyLevel': {
    type: 'select',
    label: 'Concurrency level',
    options: [
      {
        items: [
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
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
  },
  'rest.pingMethod': {
    type: 'select',
    label: 'Ping method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'rest.pingBody': {
    type: 'text',
    label: 'Ping body',
  },
  // #endregion rest
  // #region http
  'http.auth.type': {
    type: 'select',
    label: 'Authentication type',
    required: true,
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
          { label: 'OAuth 2.0', value: 'oauth' },
          { label: 'Custom', value: 'custom' },
          { label: 'Cookie', value: 'cookie' },
          { label: 'Digest', value: 'digest' },
          { label: 'WSSE', value: 'wsse' },
        ],
      },
    ],
  },
  'http.mediaType': {
    type: 'select',
    label: 'Media type',
    required: true,
    defaultValue: r => (r && r.http && r.http.mediaType) || 'json',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
          { label: 'URL Encoded', value: 'urlencoded' },
          { label: 'Multipart/form-data', value: 'form-data' },
        ],
      },
    ],
  },
  'http.successMediaType': {
    type: 'select',
    label: 'Success media type',
    helpKey: 'connection.http.successMediaType',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
          { label: 'CSV', value: 'csv' },
        ],
      },
    ],
  },
  'http.errorMediaType': {
    type: 'select',
    label: 'Error media type',
    helpKey: 'connection.http.errorMediaType',
    options: [
      {
        items: [
          { label: 'XML', value: 'xml' },
          { label: 'JSON', value: 'json' },
        ],
      },
    ],
  },
  configureApiRateLimits: {
    label: 'Configure api rate limits',
    type: 'checkbox',
    defaultValue: r =>
      r && r.http && r.http.rateLimit && r.http.rateLimit.limit,
  },
  'http.baseURI': {
    type: 'text',
    label: 'Base URI',
    required: true,
  },
  'http.disableStrictSSL': {
    type: 'checkbox',
    label: 'Disable strict SSL',
  },
  'rdbms.disableStrictSSL': {
    type: 'checkbox',
    label: 'Disable strict SSL',
  },
  'http.concurrencyLevel': {
    label: 'Concurrency level',
    type: 'select',
    options: [
      {
        items: [
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
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
  },
  'http.retryHeader': {
    type: 'text',
    label: 'Retry-after HTTP response header name',
  },
  'http.ping.relativeURI': {
    type: 'text',
    label: 'Ping relative URI',
  },
  'http.ping.method': {
    type: 'select',
    label: 'Ping method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
    ],
  },
  'http.ping.body': {
    type: 'text',
    label: 'Ping body',
  },
  'http.ping.successPath': {
    type: 'text',
    label: 'Ping success path',
  },
  'http.ping.successValues': {
    type: 'text',
    label: 'Ping success values',
    delimiter: ',',
  },
  'http.ping.failPath': {
    type: 'text',
    label: 'Ping fail path',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.ping.failValues': {
    type: 'text',
    delimiter: ',',
    label: 'Ping fail values',
    visibleWhen: [
      {
        field: 'outputMode',
        is: ['records'],
      },
    ],
  },
  'http.ping.errorPath': {
    type: 'text',
    label: 'Ping error path',
  },
  'http.auth.failStatusCode': {
    type: 'text',
    label: 'Authentication fail status code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.auth.failPath': {
    type: 'text',
    label: 'Authentication fail path',
  },
  'http.auth.failValues': {
    type: 'text',
    delimiter: ',',
    label: 'Authentication fail values',
  },
  'http.auth.basic.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'http.auth.basic.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    required: true,
  },
  'http.auth.oauth.tokenURI': {
    type: 'text',
    label: 'Access token URL',
  },
  'http.auth.oauth.scope': {
    type: 'selectscopes',
    label: 'Configure scopes',
  },
  'http.auth.oauth.scopeDelimiter': {
    type: 'text',
    label: 'Custom scope delimiter',
    subSectionField: true,
  },
  'http.auth.oauth.accessTokenPath': {
    type: 'text',
    label: 'Http auth oauth access token path',
  },
  'http.auth.oauth.authURI': {
    type: 'text',
    label: 'Authentication URL',
  },
  'http.auth.oauth.clientCredentialsLocation': {
    type: 'select',
    label: 'Client authentication',
    defaultValue: r =>
      (r &&
        r.http &&
        r.http.auth &&
        r.http.auth.oauth &&
        r.http.auth.oauth.clientCredentialsLocation) ||
      'body',
    options: [
      {
        items: [
          { label: 'Send as basic auth header', value: 'basicauthheader' },
          { label: 'Send client credentials in body', value: 'body' },
        ],
      },
    ],
  },
  'http.auth.oauth.accessTokenHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Access token headers',
  },
  'http.auth.oauth.accessTokenBody': {
    type: 'httprequestbody',
    contentType: 'json',
    label: 'Access token body',
  },
  'http._iClientId': {
    label: 'IClient',
    type: 'selectresource',
    resourceType: 'iClients',
    allowNew: true,
    allowEdit: true,
  },
  'http.auth.oauth.grantType': {
    type: 'select',
    label: 'Grant type',
    options: [
      {
        items: [
          { label: 'Authorization Code', value: 'authorizecode' },
          // { label: 'Password', value: 'password' },
          { label: 'Client Credentials', value: 'clientcredentials' },
        ],
      },
    ],
  },
  'http.auth.oauth.username': {
    type: 'text',
    label: 'Http auth oauth username',
  },
  'http.auth.oauth.applicationType': {
    type: 'select',
    label: 'Provider',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.oauth &&
      r.http.auth.oauth.grantType
        ? 'custom'
        : r &&
          r.http &&
          r.http.auth &&
          r.http.auth.oauth &&
          r.http.auth.oauth.applicationType,
    options: [
      {
        items: [{ label: 'Custom', value: 'custom' }],
      },
    ],
  },
  'http.auth.oauth.callbackURL': {
    type: 'text',
    label: 'Callback URL',
    defaultDisabled: true,
    defaultValue: () => `${getDomainUrl()}/connection/oauth2callback`,
  },
  'http.auth.oauth.type': {
    defaultValue: 'custom',
  },
  'http.auth.token.revoke.uri': {
    type: 'text',
    label: 'Revoke token URL',
  },
  'http.auth.token.revoke.body': {
    type: 'httprequestbody',
    contentType: 'json',
    label: 'Revoke token body',
  },
  'http.auth.token.revoke.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Revoke token headers',
  },
  'http.auth.oauth.password': {
    type: 'text',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    label: 'Http auth oauth password',
  },
  'http.auth.token.token': {
    type: 'text',
    label: 'Token',
    inputType: 'password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'http.auth.token.location': {
    type: 'select',
    label: 'Location',
    required: true,
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.location,
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
  'http.auth.token.headerName': {
    type: 'text',
    label: 'Header name',
    defaultValue: r =>
      (r &&
        r.http &&
        r.http.auth &&
        r.http.auth.token &&
        r.http.auth.token.headerName) ||
      'Authorization',
  },
  'http.auth.token.scheme': {
    type: 'select',
    label: 'Scheme',
    required: true,
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
  },
  'http.auth.token.paramName': {
    type: 'text',
    label: 'Parameter name',
    required: true,
  },
  'http.auth.token.refreshMethod': {
    type: 'select',
    label: 'Refresh method',
    defaultValue: r =>
      r &&
      r.http &&
      r.http.auth &&
      r.http.auth.token &&
      r.http.auth.token.refreshMethod,
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
    ],
  },
  'http.auth.token.refreshRelativeURI': {
    type: 'text',
    label: 'Refresh relative URI',
    required: true,
  },
  'http.auth.token.refreshBody': {
    type: 'text',
    label: 'Refresh body',
  },
  'http.auth.token.refreshTokenPath': {
    type: 'text',
    label: 'Refresh token path',
  },
  'http.auth.token.refreshMediaType': {
    type: 'select',
    label: 'Refresh media type',
    required: true,
    options: [
      {
        items: [
          { label: 'JSON', value: 'json' },
          { label: 'URL Encoded', value: 'urlencoded' },
          { label: 'XML', value: 'xml' },
        ],
      },
    ],
  },
  'http.auth.token.refreshHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Refresh token headers',
  },
  'http.auth.token.refreshToken': {
    type: 'text',
    inputType: 'password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    label: 'Refresh token',
  },
  'http.auth.cookie.uri': {
    type: 'text',
    label: 'Cookie URI',
  },
  'http.auth.cookie.body': {
    type: 'text',
    label: 'Cookie body',
  },
  'http.auth.cookie.method': {
    type: 'select',
    label: 'Cookie method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
        ],
      },
    ],
  },
  'http.auth.cookie.successStatusCode': {
    type: 'text',
    label: 'Cookie success status code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.rateLimits': {
    type: 'labeltitle',
    label: 'Nonstandard API rate limiter',
  },
  'http.rateLimit.failStatusCode': {
    type: 'text',
    label: 'HTTP status code for rate-limit errors',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.rateLimit.failPath': {
    type: 'text',
    label: 'Path to rate-limit errors in HTTP response body',
  },
  'http.rateLimit.failValues': {
    type: 'text',
    label: 'Rate-limit error values',
    delimiter: ',',
  },
  'http.rateLimit.limit': {
    type: 'text',
    label: 'Wait time between HTTP requests',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'http.headers': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    defaultValue: r => (r && r.http && r.http.headers) || '',
    label: 'Configure HTTP headers',
  },
  'http.unencrypted': {
    type: 'editor',
    mode: 'json',
    label: 'Unencrypted',
  },
  'http.encrypted': {
    type: 'editor',
    mode: 'json',
    label: 'Encrypted',
  },
  'http.clientCertificates.cert': {
    type: 'uploadfile',
    placeholder: 'SSL certificate:',
    label: 'SSL certificate',
    helpKey: 'connection.http.clientCertificates.cert',
  },
  'http.clientCertificates.key': {
    type: 'uploadfile',
    placeholder: 'SSL client key:',
    label: 'SSL client key',
    helpKey: 'connection.http.clientCertificates.key',
  },
  'http.clientCertificates.passphrase': {
    type: 'text',
    label: 'SSL passphrase',
    helpKey: 'connection.http.clientCertificates.passphrase',
  },
  // #endregion http
  // #region ftp
  'ftp.hostURI': {
    type: 'text',
    label: 'Host',
    required: true,
    description:
      'If the FTP server is behind a firewall please whitelist the following IP addresses: 52.2.63.213, 52.7.99.234, and 52.71.48.248.',
  },
  'ftp.type': {
    type: 'radiogroup',
    label: 'Protocol',
    required: true,
    defaultValue: r => (r && r.ftp && r.ftp.type) || 'sftp',
    options: [
      {
        items: [
          { label: 'FTP', value: 'ftp' },
          { label: 'SFTP', value: 'sftp' },
          { label: 'FTPS', value: 'ftps' },
        ],
      },
    ],
  },
  'ftp.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'ftp.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    requiredWhen: [
      {
        field: 'ftp.type',
        is: ['ftp'],
      },
      {
        field: 'ftp.authKey',
        is: [''],
      },
    ],
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.authKey': {
    type: 'text',
    label: 'Authentication key (pem format)',
    placeholder: 'Optional if password is entered',
    multiline: true,
  },
  'ftp.port': {
    type: 'ftpport',
    label: 'Port',
    required: true,
    validWhen: {
      fallsWithinNumericalRange: {
        min: 0,
        max: 65535,
        message: 'The value must be more than 0 and less than 65535',
      },
      matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
    },
  },
  'ftp.usePassiveMode': {
    type: 'checkbox',
    label: 'Use passive mode',
    defaultValue: r => (r && r.ftp && r.ftp.usePassiveMode) || 'true',
  },
  'ftp.entryParser': {
    type: 'select',
    label: 'Entry parser',
    options: [
      {
        items: [
          { label: 'UNIX', value: 'UNIX' },
          { label: 'UNIX-TRIM', value: 'UNIX-TRIM' },
          { label: 'VMS', value: 'VMS' },
          { label: 'WINDOWS', value: 'WINDOWS' },
          { label: 'OS/2', value: 'OS/2' },
          { label: 'OS/400', value: 'OS/400' },
          { label: 'AS/400', value: 'AS/400' },
          { label: 'MVS', value: 'MVS' },
          { label: 'UNKNOWN-TYPE', value: 'UNKNOWN-TYPE' },
          { label: 'NETWARE', value: 'NETWARE' },
          { label: 'MACOS-PETER', value: 'MACOS-PETER' },
        ],
      },
    ],
  },
  'ftp.userDirectoryIsRoot': {
    type: 'checkbox',
    label: 'User directory is root',
    defaultValue: r => !!(r?.ftp?.userDirectoryIsRoot),
  },
  'ftp.useImplicitFtps': {
    type: 'checkbox',
    label: 'Use implicit ftps',
    defaultValue: r => !!(r?.ftp?.useImplicitFtps),
  },
  'ftp.requireSocketReUse': {
    type: 'checkbox',
    label: 'Require socket reuse',
    defaultValue: r => !!(r?.ftp?.requireSocketReUse),
  },
  'ftp.usePgp': {
    type: 'checkbox',
    defaultValue: r =>
      !!(r && r.ftp && (r.ftp.pgpEncryptKey || r.ftp.pgpDecryptKey)),
    label: 'Use PGP encryption',
  },
  'ftp.pgpEncryptKey': {
    type: 'text',
    multiline: true,
    label: 'PGP public key',
    requiredWhen: [
      {
        field: 'ftp.pgpDecryptKey',
        is: [''],
      },
    ],
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.pgpKeyAlgorithm': {
    type: 'select',
    label: 'PGP encryption algorithm',
    defaultValue: r => (r && r.ftp && r.ftp.pgpKeyAlgorithm) || 'CAST5',
    description:
      'Note: for security reasons this field must always be re-entered.',
    options: [
      {
        items: [
          { label: 'Please select (Optional)', value: '' },
          { label: 'AES-256', value: 'AES-256' },
          { label: 'AES-192', value: 'AES-192' },
          { label: 'AES-128', value: 'AES-128' },
          { label: '3DES', value: '3DES' },
          { label: 'CAST5', value: 'CAST5' },
        ],
      },
    ],
  },
  'ftp.pgpDecryptKey': {
    type: 'text',
    label: 'PGP private key',
    multiline: true,
    requiredWhen: [
      {
        field: 'ftp.pgpEncryptKey',
        is: [''],
      },
    ],
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.pgpPassphrase': {
    type: 'text',
    label: 'PGP passphrase',
    requiredWhen: [
      {
        field: 'ftp.pgpDecryptKey',
        isNot: [''],
      },
    ],
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  usePgp: {
    type: 'checkbox',
    defaultValue: r =>
      !!(r?.pgp?.publicKey || r?.pgp?.privateKey),
    label: 'Enable PGP cryptographic',
  },
  'pgp.publicKey': {
    type: 'text',
    multiline: true,
    label: 'PGP public key',
    defaultValue: '',
    requiredWhen: [
      {
        field: 'pgp.privateKey',
        is: [''],
      },
    ],
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'pgp.compressionAlgorithm': {
    type: 'select',
    label: 'Compression algorithm',
    skipSort: true,
    options: [
      {
        items: [
          { label: 'zip', value: 'zip' },
          { label: 'zlib', value: 'zlib' },
          { label: 'bzip2', value: 'bzip2' },
        ],
      },
    ],
  },
  'pgp.asciiArmored': {
    label: 'ASCII armor',
    type: 'radiogroup',
    defaultValue: r => r?.pgp?.asciiArmored === false ? 'false' : 'true',
    options: [
      {
        items: [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' },
        ],
      },
    ],
  },
  'pgp.privateKey': {
    type: 'text',
    label: 'PGP private key',
    defaultValue: '',
    multiline: true,
    requiredWhen: [
      {
        field: 'pgp.publicKey',
        is: [''],
      },
    ],
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'pgp.passphrase': {
    type: 'text',
    label: 'Private key passphrase',
    defaultValue: '',
    requiredWhen: [
      {
        field: 'pgp.privateKey',
        isNot: [''],
      },
    ],
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.concurrencyLevel': {
    label: 'Concurrency level',
    type: 'select',
    options: [
      {
        items: [
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
          { label: '4', value: 4 },
        ],
      },
    ],
  },
  // #endregion ftp
  // #region s3
  's3.accessKeyId': {
    type: 'text',
    label: 'Access key ID',
  },
  's3.secretAccessKey': {
    type: 'text',
    label: 'Secret access key',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  's3.pingBucket': {
    type: 'text',
    label: 'Ping bucket',
  },
  // #endregion s3
  // #region as2
  'as2.as2Id': {
    type: 'text',
    label: 'AS2 identifier',
    required: true,
  },
  'as2.partnerId': {
    type: 'text',
    label: "Partner's AS2 Identifier:",
    required: true,
  },
  'as2.partnerStationInfo.as2URI': {
    type: 'text',
    label: "Partner's AS2 URL:",
    required: true,
    validWhen: {
      matchesRegEx: {
        pattern: URI_VALIDATION_PATTERN,
        message: 'Please enter a valid URI.',
      },
    },
  },
  'as2.partnerStationInfo.mdn.verifyMDNSignature': {
    type: 'checkbox',
    label: 'Partner requires MDN signature verification',
  },
  'as2.userStationInfo.mdn.mdnURL': {
    type: 'text',
    label: "Partner's URL for Asynchronous MDN:",
    required: true,
    visibleWhen: [
      {
        field: 'partnerrequireasynchronousmdns',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.mdn.signatureProtocol': {
    type: 'radiogroup',
    label: 'As2 partner station info mdn signature protocol',
    options: [
      { items: [{ label: 'Pkcs7-signature', value: 'pkcs7-signature' }] },
    ],
  },
  'as2.partnerStationInfo.mdn.mdnSigning': {
    type: 'select',
    label: 'MDN verification algorithm',
    options: [
      {
        items: [
          { label: 'SHA1', value: 'SHA1' },
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.mdn.verifyMDNSignature',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.failStatusCode': {
    type: 'text',
    label: 'Authentication fail status code',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]$', message: 'Only numbers allowed' },
      },
    ],
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['basic', 'token'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.type': {
    type: 'select',
    label: 'Authentication type',
    required: true,
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
          { label: 'None', value: 'none' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.auth.failPath': {
    type: 'text',
    label: 'Authentication fail path',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['basic', 'token'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.failValues': {
    type: 'text',
    delimiter: ',',
    label: 'Authentication fail values',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['basic', 'token'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.basic.username': {
    type: 'text',
    label: 'Username',
    required: true,
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['basic'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.basic.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    defaultValue: '',
    required: true,
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['basic'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.token': {
    type: 'text',
    label: 'Token',
    required: true,
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['token'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.location': {
    type: 'select',
    label: 'Location',
    options: [
      {
        items: [
          { label: 'URL Parameter', value: 'url' },
          { label: 'Header', value: 'header' },
          { label: 'Body', value: 'body' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.type',
        is: ['token'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.headerName': {
    type: 'text',
    label: 'Header name',
    defaultValue: r =>
      (r &&
        r.as2 &&
        r.as2.partnerStationInfo &&
        r.as2.partnerStationInfo.auth &&
        r.as2.partnerStationInfo.auth.token &&
        r.as2.partnerStationInfo.auth.token.headerName) ||
      'Authorization',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.token.location',
        is: ['header'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.scheme': {
    type: 'select',
    label: 'Scheme',
    options: [
      {
        items: [
          { label: 'Bearer', value: 'bearer' },
          { label: 'MAC', value: 'mac' },
          { label: 'OAuth 2.0', value: 'oauth' },
          { label: 'None', value: 'none' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.token.location',
        is: ['header'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.paramName': {
    type: 'text',
    label: 'Parameter name',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.token.location',
        is: ['url'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshMethod': {
    type: 'select',
    label: 'Refresh method',
    options: [
      {
        items: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshRelativeURI': {
    type: 'text',
    label: 'Refresh relative URI',
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshBody': {
    type: 'editor',
    mode: 'json',
    label: 'Refresh body',
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.auth.token.refreshMethod',
        is: ['POST', 'PUT'],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshTokenPath': {
    type: 'text',
    label: 'Refresh token path',
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshMediaType': {
    type: 'select',
    label: 'Refresh media type',
    options: [
      {
        items: [
          { label: 'JSON', value: 'json' },
          { label: 'URL Encoded', value: 'urlencoded' },
          { label: 'XML', value: 'xml' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshHeaders': {
    type: 'keyvalue',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Refresh token headers',
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.auth.token.refreshToken': {
    type: 'text',
    label: 'Refresh token',
    visibleWhen: [
      {
        field: 'configureTokenRefresh',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.rateLimit.failStatusCode': {
    type: 'text',
    label: 'HTTP status code for rate-limit errors',
    visibleWhen: [
      {
        field: 'configureApiRateLimits',
        is: [true],
      },
    ],
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]$', message: 'Only numbers allowed' },
      },
    ],
  },
  'as2.partnerStationInfo.rateLimit.failPath': {
    type: 'text',
    label: 'Path to rate-limit errors in HTTP response body',
    visibleWhen: [
      {
        field: 'configureApiRateLimits',
        is: [true],
      },
    ],
  },
  'as2.partnerStationInfo.rateLimit.failValues': {
    type: 'text',
    delimiter: ',',
    visibleWhen: [
      {
        field: 'configureApiRateLimits',
        is: [true],
      },
    ],
    label: 'Rate-limit error values',
  },
  'as2.partnerStationInfo.rateLimit.limit': {
    type: 'text',
    label: 'Wait time between HTTP requests',
    visibleWhen: [
      {
        field: 'configureApiRateLimits',
        is: [true],
      },
    ],
    requiredWhen: [
      {
        field: 'configureApiRateLimits',
        is: [true],
      },
    ],
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]$', message: 'Only numbers allowed' },
      },
      {
        fallsWithinNumericalRange: {
          message:
            'The value must be greater than undefined and  lesser than undefined',
        },
      },
    ],
  },
  'as2.partnerStationInfo.encryptionType': {
    type: 'select',
    label: 'Encryption type',
    required: true,
    options: [
      {
        items: [
          { label: 'None', value: 'NONE' },
          { label: 'DES', value: 'DES' },
          { label: 'RC2', value: 'RC2' },
          { label: '3DES', value: '3DES' },
          { label: 'AES128', value: 'AES128' },
          { label: 'AES256', value: 'AES256' },
        ],
      },
    ],
  },
  requiremdnspartners: {
    type: 'labelvalue',
    label: 'Require MDNs from partners?',
    value: 'Yes',
  },
  requireasynchronousmdns: {
    type: 'labelvalue',
    label: 'Require asynchronous MDNs?',
    value: 'No',
  },
  partnerrequireasynchronousmdns: {
    type: 'checkbox',
    label: 'Partner requires asynchronous MDNs?',
  },
  'as2.userStationInfo.ipAddresses': {
    type: 'labelvalue',
    label: 'AS2 ip addresses',
    value: 'Click here to see the list of IP Addresses.',
  },
  'as2.partnerStationInfo.signing': {
    type: 'select',
    label: 'Signing',
    required: true,
    options: [
      {
        items: [
          { label: 'None', value: 'NONE' },
          { label: 'SHA1', value: 'SHA1' },
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.encoding': {
    type: 'select',
    label: 'Encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'as2.partnerStationInfo.encryptionType',
        isNot: ['NONE'],
      },
    ],
  },
  'as2.partnerStationInfo.signatureEncoding': {
    type: 'select',
    label: 'Signature encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.encrypted.userPrivateKey': {
    type: 'editor',
    mode: 'text',
    label: 'X.509 Private Key',
    requiredWhen: [
      {
        field: 'as2.userStationInfo.encryptionType',
        isNot: ['NONE'],
      },
    ],
  },
  'as2.userStationInfo.mdn.mdnSigning': {
    type: 'select',
    label: 'MDN signing',
    required: true,
    options: [
      {
        items: [
          { label: 'None', value: 'NONE' },
          { label: 'SHA1', value: 'SHA1' },
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
    ],
  },
  'as2.userStationInfo.mdn.mdnEncoding': {
    type: 'select',
    label: 'MDN encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.userStationInfo.encryptionType': {
    type: 'select',
    label: 'Decryption algorithm',
    required: true,
    options: [
      {
        items: [
          { label: 'None', value: 'NONE' },
          { label: 'DES', value: 'DES' },
          { label: 'RC2', value: 'RC2' },
          { label: '3DES', value: '3DES' },
          { label: 'AES128', value: 'AES128' },
          { label: 'AES256', value: 'AES256' },
        ],
      },
    ],
  },
  'as2.userStationInfo.signing': {
    type: 'select',
    label: 'Signature verification algorithm',
    required: true,
    options: [
      {
        items: [
          { label: 'None', value: 'NONE' },
          { label: 'SHA1', value: 'SHA1' },
          { label: 'MD5', value: 'MD5' },
          { label: 'SHA256', value: 'SHA256' },
        ],
      },
    ],
  },
  'as2.partnerStationInfo.mdnSigning': {
    type: 'select',
    label: 'Signature encoding',
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
  },
  'as2.userStationInfo.encoding': {
    type: 'select',
    label: 'Incoming message encoding',
    required: true,
    options: [
      {
        items: [
          { label: 'Base64', value: 'base64' },
          { label: 'Binary', value: 'binary' },
        ],
      },
    ],
    visibleWhen: [
      {
        field: 'as2.userStationInfo.encryptionType',
        isNot: ['NONE'],
      },
    ],
  },
  'as2.unencrypted.userPublicKey': {
    type: 'editor',
    mode: 'text',
    label: 'X.509 Public Certificate',
    requiredWhen: [
      {
        field: 'as2.userStationInfo.encryptionType',
        isNot: ['NONE'],
      },
    ],
  },
  'as2.unencrypted.partnerCertificate': {
    type: 'editor',
    mode: 'text',
    label: "Partner's Certificate:",
    requiredWhen: [
      {
        field: 'as2.partnerStationInfo.encryptionType',
        isNot: ['NONE'],
      },
    ],
  },
  'as2.preventCanonicalization': {
    label: 'Prevent canonicalization',
    type: 'checkbox',
  },
  'as2.concurrencyLevel': {
    label: 'Concurrency level',
    type: 'select',
    options: [
      {
        items: [
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
  },
  'as2.contentBasedFlowRouter': {
    type: 'routingrules',
    label: 'Routing rules editor',
    required: false,
    editorResultMode: 'text',
    hookStage: 'contentBasedFlowRouter',
    helpKey: 'connection.as2.contentBasedFlowRouter',
    title: 'Choose a script and function name to use for determining AS2 message routing',
    preHookData: {
      httpHeaders: {
        'as2-from': 'OpenAS2_appA',
        'as2-to': 'OpenAS2_appB',
      },
      mimeHeaders: {
        'content-type': 'application/edi-x12',
        'content-disposition': 'Attachment; filename=rfc1767.dat',
      },
      rawMessageBody: 'sample message',
    },
  },
  // #endregion as2
  // #region netsuite
  'netsuite.authType': {
    type: 'select',
    label: 'Authentication type',
    options: [
      {
        items: [
          { label: 'Basic (To be deprecated - Do not use)', value: 'basic' },
          { label: 'Token Based Auth (Manual)', value: 'token' },
          { label: 'Token Based Auth (Automatic)', value: 'token-auto' },
        ],
      },
    ],
  },
  'netsuite.account': {
    type: 'netsuiteuserroles',
    label: 'Account ID',
  },
  'netsuite.tokenId': {
    type: 'text',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    required: true,
    label: 'Token ID',
  },
  'netsuite.tokenSecret': {
    type: 'text',
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    required: true,
    label: 'Token secret',
  },
  'netsuite.tokenEnvironment': {
    type: 'select',
    label: 'Environment',
    defaultValue: r => r && r.netsuite && r.netsuite.environment,
    options: [
      {
        items: [
          { value: 'production', label: 'Production' },
          { value: 'sandbox2.0', label: 'Sandbox2.0' },
          { value: 'beta', label: 'Beta' },
        ],
      },
    ],
  },
  'netsuite.environment': {
    type: 'netsuiteuserroles',
    label: 'Environment',
  },
  'netsuite.roleId': {
    type: 'netsuiteuserroles',
    label: 'Role',
  },
  'netsuite.email': {
    type: 'text',
    label: 'Email',
  },
  'netsuite.password': {
    type: 'text',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    inputType: 'password',
    label: 'Password',
  },
  'netsuite.requestLevelCredentials': {
    type: 'checkbox',
    label: 'NetSuite request level credentials',
  },
  'netsuite.dataCenterURLs': {
    type: 'text',
    label: 'NetSuite data center URLs',
  },
  'netsuite.accountName': {
    type: 'text',
    label: 'NetSuite account name',
  },
  'netsuite.roleName': {
    type: 'text',
    label: 'NetSuite role name',
  },
  'netsuite.concurrencyLevelRESTlet': {
    type: 'text',
    label: 'NetSuite concurrency level restlet',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.concurrencyLevelWebServices': {
    type: 'text',
    label: 'NetSuite concurrency level web services',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite.linkSuiteScriptIntegrator': {
    label: 'Link SuiteScript integrator',
    type: 'linksuitescriptintegrator',
  },
  'netsuite._iClientId': {
    label: 'IClient',
    type: 'selectresource',
    resourceType: 'iClients',
  },
  'netsuite.concurrencyLevel': {
    label: 'Concurrency level',
    type: 'select',
    defaultValue: r =>
      r && r.netsuite && r.netsuite.concurrencyLevel
        ? r.netsuite.concurrencyLevel
        : 1,
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
    options: [
      {
        items: [
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
  },
  'netsuite.wsdlVersion': {
    type: 'radiogroup',
    label: 'NetSuite wsdl version',
    options: [
      {
        items: [
          { label: 'Current', value: 'current' },
          { label: 'Next', value: 'next' },
        ],
      },
    ],
  },
  'netsuite.applicationId': {
    type: 'text',
    label: 'NetSuite application ID',
  },
  // #endregion netsuite
  // #region netSuiteDistributedAdaptor
  'netSuiteDistributedAdaptor.accountId': {
    type: 'text',
    label: 'Net suite distributed adaptor account ID',
  },
  'netSuiteDistributedAdaptor.environment': {
    type: 'select',
    label: 'Net suite distributed adaptor environment',
    options: [
      {
        items: [
          { label: 'Production', value: 'production' },
          { label: 'Sandbox', value: 'sandbox' },
          { label: 'Beta', value: 'beta' },
          { label: 'Sandbox2.0', value: 'sandbox2.0' },
        ],
      },
    ],
  },
  'netSuiteDistributedAdaptor.connectionId': {
    type: 'text',
    label: 'Net suite distributed adaptor connection ID',
  },
  'netSuiteDistributedAdaptor.username': {
    type: 'text',
    label: 'Net suite distributed adaptor username',
  },
  'netSuiteDistributedAdaptor.uri': {
    type: 'text',
    label: 'Net suite distributed adaptor URI',
  },
  // #endregion netSuiteDistributedAdaptor
  // #region salesforce
  'salesforce.sandbox': {
    type: 'select',
    label: 'Account type',
    required: true,
    options: [
      {
        items: [
          { label: 'Production', value: false },
          { label: 'Sandbox', value: true },
        ],
      },
    ],
  },
  'salesforce.baseURI': {
    type: 'text',
    label: 'Salesforce base URI',
  },
  'salesforce.oauth2FlowType': {
    type: 'select',
    label: 'OAuth 2.0 flow type',
    required: true,
    options: [
      {
        items: [
          { label: 'Refresh Token', value: 'refreshToken' },
          { label: 'JWT Bearer Token', value: 'jwtBearerToken' },
        ],
      },
    ],
  },
  'salesforce.username': {
    type: 'text',
    label: 'Username',
    visibleWhen: [
      {
        field: 'salesforce.oauth2FlowType',
        is: ['jwtBearerToken'],
      },
    ],
  },
  'salesforce.bearerToken': {
    type: 'text',
    label: 'Salesforce bearer token',
  },
  'salesforce.refreshToken': {
    type: 'text',
    label: 'Salesforce refresh token',
  },
  'salesforce.packagedOAuth': {
    type: 'checkbox',
    label: 'Salesforce packaged oauth',
  },
  'salesforce.scopes': {
    type: 'text',
    keyName: 'name',
    valueName: 'value',
    valueType: 'array',
    label: 'Salesforce scope',
  },
  'salesforce.info': {
    type: 'text',
    label: 'Salesforce info',
  },
  'salesforce.concurrencyLevel': {
    type: 'select',
    label: 'Concurrency level',
    defaultValue: r =>
      r && r.salesforce && r.salesforce.concurrencyLevel ? r && r.salesforce && r.salesforce.concurrencyLevel : 5,
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
    options: [
      {
        items: [
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
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
  },
  // #endregion salesforce
  // #region wrapper
  'wrapper.unencrypted': {
    type: 'editor',
    mode: 'json',
    label: 'Unencrypted',
  },
  'wrapper.encrypted': {
    type: 'editor',
    mode: 'json',
    label: 'Encrypted',
    defaultValue: '',
  },
  'wrapper.pingFunction': {
    type: 'text',
    label: 'Ping function',
    required: true,
    visible: r => !(r && r._connectorId),
  },
  'wrapper._stackId': {
    label: 'Stack',
    type: 'selectresource',
    placeholder: 'Please select a stack',
    resourceType: 'stacks',
    required: true,
    visible: r => !(r && r._connectorId),
  },
  'wrapper.concurrencyLevel': {
    type: 'select',
    label: 'Concurrency level',
    options: [
      {
        items: [
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
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
    visibleWhen: [
      {
        field: '_borrowConcurrencyFromConnectionId',
        is: [''],
      },
    ],
    defaultValue: r => (r && r.wrapper && r.wrapper.concurrencyLevel) || 1,
  },
  // #endregion wrapper
  // #region mongodb
  'mongodb.host': {
    type: 'text',
    required: true,
    omitWhenValueIs: [''],
    label: 'Host(s)',
    defaultValue: r => r && r.mongodb && r.mongodb.host[0],
  },
  'mongodb.database': {
    type: 'text',
    label: 'Database',
  },
  'mongodb.username': {
    type: 'text',
    required: true,
    label: 'Username',
  },
  'mongodb.password': {
    type: 'text',
    required: true,
    inputType: 'password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    label: 'Password',
  },
  'mongodb.replicaSet': {
    type: 'text',
    label: 'Replica set',
  },
  'mongodb.ssl': {
    type: 'checkbox',
    label: 'TLS/SSL',
    defaultValue: r => (r && r.mongodb && r.mongodb.ssl) || false,
  },
  'mongodb.authSource': {
    type: 'text',
    label: 'Auth source',
  },
  // #endregion mongodb
  // #region dynamodb
  'dynamodb.aws.accessKeyId': {
    type: 'text',
    label: 'Access key ID',
    required: true,
    helpKey: 'connection.dynamodb.aws.accessKeyId',
  },
  'dynamodb.aws.secretAccessKey': {
    type: 'text',
    label: 'Secret access key',
    required: true,
    helpKey: 'connection.dynamodb.aws.secretAccessKey',
  },
  // #endregion dynamodb
  settings: {
    type: 'settings',
    defaultValue: r => r && r.settings,
  },
  // #region custom connection
};
