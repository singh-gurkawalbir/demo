import { PASSWORD_MASK } from '../../../constants';
import {
  updateFinalMetadataWithHttpFramework,
} from '../../../sagas/utils';
import { safeParse } from '../../../utils/string';
import { updateHTTPFrameworkFormValues } from '../../metaDataUtils/fileUtil';

export default {
  init: (fieldMeta, resource, flow, httpConnector) => {
    if (!resource?._httpConnectorId && !resource?.http?._httpConnectorId) {
      return fieldMeta;
    }

    return updateFinalMetadataWithHttpFramework(fieldMeta, httpConnector, resource, true);
  },
  preSave: (formValues, resource, options) => {
    let newValues = { ...formValues};

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

    if (!newValues['/http/ping/method']) {
      newValues['/http/ping/method'] = undefined;
    }

    if (newValues['/http/encrypted']) {
      try {
        newValues['/http/encrypted'] = JSON.parse(newValues['/http/encrypted']);
      } catch (ex) {
        newValues['/http/encrypted'] = undefined;
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

    if (newValues['/http/auth/type'] === 'digest') {
      newValues['/http/auth/basic/username'] = newValues['/http/auth/digest/username'];
      newValues['/http/auth/basic/password'] = newValues['/http/auth/digest/password'];
    }
    if (
      !['custom', 'token'].includes(newValues['/http/auth/type']) ||
      (newValues['/http/auth/type'] === 'custom' && !newValues['/configureCutomAuthTokenRefresh']) ||
      (newValues['/http/auth/type'] === 'token' && !newValues['/configureTokenRefresh'])
    ) {
      newValues['/http/auth/token/refreshMethod'] = undefined;
      newValues['/http/auth/token/refreshTokenPath'] = undefined;
      newValues['/http/auth/token/refreshToken'] = undefined;
      newValues['/http/auth/token/refreshHeaders'] = undefined;
      newValues['/http/auth/token/refreshBody'] = undefined;
      newValues['/http/auth/token/refreshRelativeURI'] = undefined;
      newValues['/http/auth/token/refreshMediaType'] = undefined;
      newValues['/http/auth/token/tokenPaths'] = undefined;
    }
    if (newValues['/http/auth/type'] !== 'custom' || !newValues['/http/auth/token/tokenPaths']) {
      // tokenPaths are only supported for custom auth type refresh token
      newValues['/http/auth/token/tokenPaths'] = undefined;
    }
    if (newValues['/http/auth/type'] === 'token' || newValues['/http/auth/type'] === 'oauth') {
      if (newValues['/http/auth/token/scheme'] === 'Custom') {
        newValues['/http/auth/token/scheme'] = newValues['/http/customAuthScheme'];
      }
    }

    if (newValues['/http/custom/encrypted']) {
      const tokenPathsDefaultObject = newValues['/http/auth/token/tokenPaths']?.reduce?.((a, v) => ({ ...a, [v]: PASSWORD_MASK}), {});

      const encryptedFieldValue = safeParse(newValues['/http/custom/encrypted']);

      newValues['/http/custom/encrypted'] = encryptedFieldValue;

      if (typeof tokenPathsDefaultObject === 'object') {
        newValues['/http/custom/encrypted'] = tokenPathsDefaultObject;
      }

      if (typeof encryptedFieldValue === 'object') {
        // override the default token paths with user provided values
        newValues['/http/custom/encrypted'] = {
          ...(newValues['/http/custom/encrypted'] || {}),
          ...encryptedFieldValue,
        };
      }
    }
    if (newValues['/http/auth/type'] !== 'token' && newValues['/http/auth/type'] !== 'oauth') {
      newValues['/http/auth/oauth'] = undefined;
      delete newValues['/http/auth/oauth/callbackURL'];
      delete newValues['/http/auth/oauth/clientCredentialsLocation'];
      delete newValues['/http/auth/oauth/accessTokenBody'];
      delete newValues['/http/auth/oauth/authURI'];
      delete newValues['/http/auth/oauth/grantType'];
      delete newValues['/http/auth/oauth/tokenURI'];
      delete newValues['/http/auth/oauth/refreshBody'];

      delete newValues['/http/auth/oauth/scope'];
      delete newValues['/http/auth/oauth/scopeDelimiter'];

      newValues['/http/auth/token'] = undefined;
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
      newValues['/http/auth/token/headerName'] = newValues['/http/auth/wsse/headerName'];
      newValues['/http/auth/basic/username'] = newValues['/http/auth/wsse/username'];
      newValues['/http/auth/basic/password'] = newValues['/http/auth/wsse/password'];
    }

    if (newValues['/http/auth/type'] === 'custom') {
      newValues['/http/encrypted'] = newValues['/http/custom/encrypted'];
      newValues['/http/unencrypted'] = newValues['/http/custom/unencrypted'];
    }

    newValues['/http/auth/failPath'] = newValues['/http/auth/type'] === 'oauth' ? newValues['/http/auth/failPathForOauth'] : newValues['/http/auth/failPath'];
    newValues['/http/auth/failValues'] = newValues['/http/auth/type'] === 'oauth' ? newValues['/http/auth/failValuesForOauth'] : newValues['/http/auth/failValues'];

    if (!newValues['/http/auth/failPath']) {
      newValues['/http/auth/failValues'] = undefined;
    }

    delete newValues['/http/auth/failPathForOauth'];
    delete newValues['/http/auth/failValuesForOauth'];
    delete newValues['/http/auth/oauth/refreshHeaders'];
    delete newValues['/http/auth/oauth/refreshBody'];
    delete newValues['/http/custom/encrypted'];
    delete newValues['/http/custom/unencrypted'];
    delete newValues['/http/auth/digest/username'];
    delete newValues['/http/auth/digest/password'];
    delete newValues['/http/auth/wsse/username'];
    delete newValues['/http/auth/wsse/password'];
    delete newValues['/http/auth/wsse/headerName'];
    if (resource?._httpConnectorId || resource?.http?._httpConnectorId) {
      newValues = updateHTTPFrameworkFormValues(newValues, resource, options?.httpConnector);
    }

    if (newValues['/http/formType'] !== 'graph_ql') {
      newValues['/http/formType'] = 'http';
    }

    if (newValues['/http/clientCertificates/type'] === 'pem') {
      newValues['/http/clientCertificates'] = undefined;
      delete newValues['/http/clientCertificates/pfx'];
    }

    if (newValues['/http/clientCertificates/type'] === 'pfx') {
      newValues['/http/clientCertificates'] = undefined;
      delete newValues['/http/clientCertificates/cert'];
      delete newValues['/http/clientCertificates/key'];
      if (newValues['/http/clientCertificates/pfx'].includes('data:application/x-pkcs12;base64,')) {
        newValues['/http/clientCertificates/pfx'] = newValues['/http/clientCertificates/pfx'].slice(33);
      }
    }

    delete newValues['/http/clientCertificates/type'];

    newValues['/configureTokenRefresh'] = undefined;
    newValues['/configureCutomAuthTokenRefresh'] = undefined;
    newValues['/assistant'] = undefined;

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    connectionFormView: {
      fieldId: 'connectionFormView',
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
    'http.auth.failPathForOauth': {
      fieldId: 'http.auth.failPathForOauth',
    },
    'http.auth.failValues': {
      fieldId: 'http.auth.failValues',
    },
    'http.auth.failValuesForOauth': {
      fieldId: 'http.auth.failValuesForOauth',
    },
    'http.baseURI': {
      fieldId: 'http.baseURI',
    },
    'http.mediaType': {
      fieldId: 'http.mediaType',
    },
    'http.type': {
      fieldId: 'http.type',
      visible: false,
      omitWhenHidden: true,
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
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['basic'] },
      ],
    },
    httpDigest: {
      formId: 'httpDigest',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['digest'] },
      ],
    },
    httpOAuth: {
      formId: 'httpOAuth',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
      ],
    },
    'http.auth.oauth.oauth1.signatureMethod': {
      fieldId: 'http.auth.oauth.oauth1.signatureMethod',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth1'] },
      ],
    },
    httpOAuth1: {
      formId: 'httpOAuth1',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth1'] },
      ],
    },
    httpWsse: {
      formId: 'httpWsse',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['wsse'] },
      ],
    },
    httpToken: {
      formId: 'httpToken',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['token'] }],
    },
    httpRefreshToken: {
      formId: 'httpRefreshToken',
      visibleWhenAll: [{
        OR: [
          {
            AND: [
              { field: 'http.auth.type', is: ['token'] },
              { field: 'http.auth.token.location', isNot: [''] },
              { field: 'configureTokenRefresh', is: [true] },
            ],
          },
          {
            AND: [
              { field: 'http.auth.type', is: ['custom'] },
              { field: 'configureCutomAuthTokenRefresh', is: [true] },
            ],
          },
        ],
      }],
    },
    httpCookie: {
      formId: 'httpCookie',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['cookie'] }],
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
    'http.clientCertificates.cert': {
      fieldId: 'http.clientCertificates.cert',
      visibleWhenAll: [
        {
          field: 'http.clientCertificates.type',
          is: ['pem'],
        },
      ],
    },
    'http.clientCertificates.pfx': {
      fieldId: 'http.clientCertificates.pfx',
      visibleWhenAll: [
        {
          field: 'http.clientCertificates.type',
          is: ['pfx'],
        },
      ],
    },
    'http.clientCertificates.key': {
      fieldId: 'http.clientCertificates.key',
      visibleWhenAll: [
        {
          field: 'http.clientCertificates.type',
          is: ['pem'],
        },
      ],
    },
    'http.clientCertificates.passphrase': {
      fieldId: 'http.clientCertificates.passphrase',
      visibleWhenAll: [
        {
          field: 'http.clientCertificates.type',
          is: ['pem', 'pfx'],
        },
      ],
    },
    'http.clientCertificates.type': {
      fieldId: 'http.clientCertificates.type',
    },
    'http.auth.oauth.applicationType': {
      fieldId: 'http.auth.oauth.applicationType',
      required: true,
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },

    'http.auth.oauth.type': {
      fieldId: 'http.auth.oauth.type',
      visibleWhen: [{ field: 'http.auth.type', is: ['oauth'] }],
    },

    'http.custom.encrypted': {
      id: 'http.custom.encrypted',
      type: 'editor',
      mode: 'json',
      label: 'Custom encrypted fields',
      helpKey: 'connection.http.encrypted',
      defaultValue: r =>
        (r && r.http && r.http.encrypted && JSON.stringify(r.http.encrypted)) ||
        '{"field": "value"}',
      visibleWhen: [{ field: 'http.auth.type', is: ['custom'] }],
      description: 'Note: for security reasons this field must always be re-entered.',
    },
    'http.custom.unencrypted': {
      id: 'http.custom.unencrypted',
      type: 'editor',
      mode: 'json',
      label: 'Custom unencrypted fields',
      helpKey: 'connection.http.unencrypted',
      visibleWhen: [{ field: 'http.auth.type', is: ['custom'] }],
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          JSON.stringify(r.http.unencrypted)) ||
        '{"field": "value"}',
    },

    application: {
      fieldId: 'application',
    },
    configureCutomAuthTokenRefresh: {
      fieldId: 'configureCutomAuthTokenRefresh',
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
          'connectionFormView',
          'mode',
          '_agentId',
        ],
      },
      {
        collapsed: true,
        label: 'Application details',
        fields: [
          'http.baseURI',
          'http.headers',
          'http.mediaType',
          'http.type',
          'http.successMediaType',
          'http.errorMediaType',
        ],
      },
      {
        collapsed: true,
        label: 'Configure authentication',
        containers: [
          {
            fields: ['http.auth.type'],
          },
          {
            type: 'collapse',
            containers: [
              {
                collapsed: true,
                label: 'Configure basic auth',
                fields: [
                  'httpBasic',
                ],
              },
              {
                collapsed: true,
                label: 'Configure cookie auth',
                fields: [
                  'httpCookie',
                ],
              },
              {
                collapsed: false,
                label: 'Configure custom auth',
                fields: [
                  'http.custom.encrypted',
                  'http.custom.unencrypted',
                  'configureCutomAuthTokenRefresh',
                ],
              },
              {
                collapsed: true,
                label: 'Configure digest auth',
                fields: [
                  'httpDigest',
                ],
              },
              {
                collapsed: true,
                label: 'Configure OAuth 2.0',
                fields: [
                  'httpOAuth',
                ],
              },
              {
                collapsed: true,
                label: 'Configure OAuth 1.0',
                fields: [
                  'http.auth.oauth.oauth1.signatureMethod',
                ],
                containers: [
                  {
                    type: 'indent',
                    containers: [
                      {
                        fields: [
                          'httpOAuth1',
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                collapsed: true,
                label: 'Configure token auth',
                fields: [
                  'httpToken',
                ],
              },
              {
                collapsed: true,
                label: 'Configure refresh token',
                fields: ['httpRefreshToken'],
              },
              {
                collapsed: true,
                label: 'Configure WSSE auth',
                fields: [
                  'httpWsse',
                ],
              },
              {
                collapsed: true,
                label: 'Non-standard API response patterns',
                fields: [
                  'http.auth.failStatusCode',
                  'http.auth.failPath',
                  'http.auth.failPathForOauth',
                  'http.auth.failValues',
                  'http.auth.failValuesForOauth',
                ],
              },
            ],
          },
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
          'http.ping.method',
          'http.ping.relativeURI',
          'http.ping.body',
          'http.ping.failPath',
          'http.ping.failValues',
          'http.ping.successPath',
          'http.ping.successValues',
          'http.ping.errorPath',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        containers: [
          {
            fields: [
              'http.disableStrictSSL',
              'httpAdvanced',
              'http.clientCertificates.type',
            ],
          },
          {
            type: 'indent',
            containers: [
              {
                fields: [
                  'http.clientCertificates.key',
                  'http.clientCertificates.cert',
                  'http.clientCertificates.pfx',
                  'http.clientCertificates.passphrase',
                ],
              },
            ],
          },
          {
            fields: [
              'http.encrypted',
              'http.unencrypted',
            ],
          },
        ],
      },
    ],
  },
  actions: [
    {
      id: 'saveandcontinuegroup',
      isHTTPForm: true,
    },
    {
      id: 'oauthandtest',
      isHTTPForm: true,
    },
    {
      id: 'saveandclosegroup',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: [''],
        },
      ],
    },
    {
      id: 'testandsavegroup',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          isNot: ['oauth'],
        },
        {
          field: 'http.auth.type',
          isNot: [''],
        },
      ],
    },
  ],
};
