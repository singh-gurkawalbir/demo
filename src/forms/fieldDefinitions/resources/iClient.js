import { getDomainUrl } from '../../../utils/resource';

export default {
  name: {
    isLoggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  provider: {
    isLoggable: true,
    type: 'text',
    label: 'Provider',
    defaultDisabled: true,
    defaultValue: r => r?.provider || 'custom_oauth2',
  },
  'oauth2.clientId': {
    type: 'text',
    label: 'Client ID',
    required: true,
    visible: r => ![r.provider, r.assistant].includes('amazonmws'),
  },
  'oauth2.clientSecret': {
    type: 'text',
    label: 'Client secret',
    description:
        'Note: for security reasons this field must always be re-entered',
    inputType: 'password',
    defaultValue: '',
    required: true,
    visible: r => ![r.provider, r.assistant].includes('amazonmws'),
  },
  'amazonmws.accessKeyId': {
    type: 'text',
    label: 'Access key ID:',
    required: true,
    visible: r => [r.provider, r.assistant].includes('amazonmws'),
  },
  'amazonmws.secretKey': {
    type: 'text',
    label: 'Secret key:',
    description:
        'Note: for security reasons this field must always be re-entered',
    defaultValue: '',
    required: true,
    visible: r => [r.provider, r.assistant].includes('amazonmws'),
  },
  'oauth2.grantType': {
    isLoggable: true,
    required: true,
    type: 'select',
    label: 'Grant type',
    options: [
      {
        items: [
          { label: 'Authorization code', value: 'authorizecode' },
          { label: 'Client credentials', value: 'clientcredentials' },
        ],
      },
    ],
  },
  'oauth2.callbackURL': {
    copyToClipboard: true,
    visibleWhenAll: [
      { field: 'oauth2.grantType', is: ['authorizecode'] },
    ],
    isLoggable: true,
    type: 'text',
    label: 'Redirect URL',
    defaultDisabled: true,
    defaultValue: () => `${getDomainUrl()}/connection/oauth2callback`,
  },
  'oauth2.auth.uri': {
    type: 'text',
    label: 'Authorization URL',
    required: true,
    visibleWhenAll: [
      { field: 'oauth2.grantType', is: ['authorizecode'] },
    ],
  },
  'oauth2.token.uri': {
    type: 'uri',
    label: 'Access token URL',
    required: true,
  },
  'oauth2.clientCredentialsLocation': {
    isLoggable: true,
    type: 'select',
    label: 'Send client credentials via',
    defaultValue: r => r?.oauth2?.clientCredentialsLocation || 'body',
    options: [
      {
        items: [
          { label: 'Basic auth header', value: 'basicauthheader' },
          { label: 'HTTP body', value: 'body' },
        ],
      },
    ],
    visibleWhenAll: [
      { field: 'oauth2.grantType', isNot: [''] },
    ],
    required: true,
  },
  'oauth2.revoke.uri': {
    type: 'uri',
    label: 'Revoke token URL',
  },
  'oauth2.validDomainNames': {
    isLoggable: true,
    required: true,
    type: 'text',
    delimiter: ',',
    label: 'Valid domain names',
    validWhen: {
      matchesRegEx: {
        pattern: '^([^,]*,){0,2}[^,]*$',
        message: 'Only 3 domain names are allowed',
      },
    },
  },
  'oauth2.scopeDelimiter': {
    isLoggable: true,
    type: 'text',
    label: 'Override default scope delimiter',
    visibleWhenAll: [
      { field: 'oauth2.grantType', isNot: [''] },
    ],
  },
  'oauth2.token.headers': {
    type: 'iclientHeaders',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Override access token HTTP headers',
  },
  'oauth2.token.body': {
    type: 'httprequestbody',
    contentType: 'json',
    label: 'Override access token HTTP request body',
  },
  'oauth2.refresh.headers': {
    type: 'iclientHeaders',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Override refresh token HTTP headers',
    visibleWhenAll: [
      { field: 'oauth2.grantType', is: ['authorizecode'] },
    ],
  },
  'oauth2.refresh.body': {
    type: 'httprequestbody',
    contentType: 'json',
    label: 'Override refresh token HTTP request body',
    visibleWhenAll: [
      { field: 'oauth2.grantType', is: ['authorizecode'] },
    ],
  },
  'oauth2.revoke.headers': {
    type: 'iclientHeaders',
    keyName: 'name',
    valueName: 'value',
    valueType: 'keyvalue',
    label: 'Override revoke token HTTP headers',
  },
  'oauth2.revoke.body': {
    type: 'httprequestbody',
    contentType: 'json',
    label: 'Override revoke token HTTP request body',
  },
  'oauth2.accessTokenLocation': {
    isLoggable: true,
    type: 'select',
    label: 'Send token via',
    required: true,
    options: [
      {
        items: [
          { label: 'URL parameter', value: 'url' },
          { label: 'HTTP header', value: 'header' },
          { label: 'HTTP body', value: 'body' },
        ],
      },
    ],
  },
  'oauth2.accessTokenHeaderName': {
    isLoggable: true,
    type: 'text',
    label: 'Header name',
    required: true,
    defaultValue: r => r?.oauth2?.accessTokenHeaderName || 'Authorization',
  },
  'oauth2.scheme': {
    isLoggable: true,
    type: 'select',
    label: 'Header scheme',
    skipDefault: true,
    defaultValue: r => {
      if (!['Bearer', 'MAC', ' '].includes(r?.oauth2?.scheme)) return 'Custom';
      if (r?.oauth2?.scheme) {
        return r.oauth2.scheme;
      }

      return '';
    },
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
  'oauth2.accessTokenParamName': {
    isLoggable: true,
    type: 'text',
    label: 'Parameter name',
    required: true,
    defaultValue: r => r?.oauth2?.accessTokenParamName || 'access_token',
  },
  'oauth2.failStatusCode': {
    isLoggable: true,
    type: 'text',
    label: 'Override HTTP status code for auth errors',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'oauth2.failPath': {
    isLoggable: true,
    type: 'text',
    label: 'Path to auth error field in HTTP response body',
  },
  'oauth2.failValues': {
    isLoggable: true,
    type: 'text',
    delimiter: ',',
    label: 'Auth error values',
  },
};
