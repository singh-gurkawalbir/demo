import {
  updateFinalMetadataWithHttpFramework,
} from '../../../sagas/utils';
import { updateHTTPFrameworkFormValues } from '../../metaDataUtils/fileUtil';
import {PASSWORD_MASK} from '../../../constants';

export default {
  init: (fieldMeta, resource, flow, httpConnector) => updateFinalMetadataWithHttpFramework(fieldMeta, httpConnector, resource),
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
      if (newValues['/http/encrypted'] === PASSWORD_MASK) { newValues['/http/encrypted'] = undefined; }
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

    if (newValues['/http/auth/type'] === 'digest') {
      newValues['/http/auth/basic/username'] = newValues['/http/auth/digest/username'];
      newValues['/http/auth/basic/password'] = newValues['/http/auth/digest/password'];
    }

    if (
      newValues['/http/auth/type'] !== 'token' ||
        !formValues['/configureTokenRefresh']
    ) {
      newValues['/http/auth/token/refreshMethod'] = undefined;
      newValues['/http/auth/token/refreshTokenPath'] = undefined;
      newValues['/http/auth/token/refreshToken'] = undefined;
      newValues['/http/auth/token/refreshHeaders'] = undefined;
      newValues['/http/auth/token/refreshBody'] = undefined;
      newValues['/http/auth/token/refreshRelativeURI'] = undefined;
      newValues['/http/auth/token/refreshMediaType'] = undefined;
    }

    if (newValues['/http/auth/type'] === 'token' || newValues['/http/auth/type'] === 'oauth') {
      if (newValues['/http/auth/token/scheme'] === 'Custom') {
        newValues['/http/auth/token/scheme'] = newValues['/http/customAuthScheme'];
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
      if (newValues['/http/encrypted'] === PASSWORD_MASK) { newValues['/http/encrypted'] = undefined; }
    }
    if (newValues['/http/auth/type'] === 'oauth') {
      newValues['/http/auth/oauth/applicationType'] = 'custom';
      newValues['/http/auth/token/refreshHeaders'] = newValues['/http/auth/oauth/refreshHeaders'];
      newValues['/http/auth/token/refreshBody'] = newValues['/http/auth/oauth/refreshBody'];
    }

    if (!newValues['/http/auth/token/revoke/uri']) delete newValues['/http/auth/token/revoke/uri'];

    if (!newValues['/http/auth/token/revoke/body']) delete newValues['/http/auth/token/revoke/body'];

    if (!newValues['/http/auth/failPath']) {
      newValues['/http/auth/failValues'] = undefined;
    }

    delete newValues['/http/auth/oauth/refreshHeaders'];
    delete newValues['/http/auth/oauth/refreshBody'];
    delete newValues['/http/custom/encrypted'];
    delete newValues['/http/custom/unencrypted'];
    delete newValues['/http/auth/digest/username'];
    delete newValues['/http/auth/digest/password'];
    delete newValues['/http/auth/wsse/username'];
    delete newValues['/http/auth/wsse/password'];
    delete newValues['/http/auth/wsse/headerName'];
    newValues['/http/formType'] = 'assistant';
    if (newValues['/http/updateBaseURI']) {
      newValues['/http/baseURI'] = newValues['/http/updateBaseURI'];
      delete newValues['/http/updateBaseURI'];
    }
    if (resource?._httpConnectorId || resource?.http?._httpConnectorId) {
      newValues = updateHTTPFrameworkFormValues(newValues, resource, options?.httpConnector);
    }

    return newValues;
  },
  fieldMap: {
    name: {
      fieldId: 'name',
      label: 'Name your connection',
    },
    'http.type': {
      fieldId: 'http.type',
      visible: false,
    },
    connectionFormView: {
      fieldId: 'connectionFormView',
    },
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
      readOnly: true,
      refreshOptionsOnChangesTo: [],
      defaultDisabled: true,
      defaultValue: r => {
        if (!r?.http?.baseURI) { return null; }

        return r?.http?.baseURI;
      },
    },
    'http.updateBaseURI': {
      fieldId: 'http.updateBaseURI',
      visible: false,
      defaultValue: r => {
        if (!r?.http?.baseURI) { return null; }

        return r?.http?.baseURI;
      },
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
    httpOAuthOverrides: {
      formId: 'httpOAuthOverrides',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['oauth'] },
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
      visibleWhenAll: [{ field: 'http.auth.type', is: ['token', 'oauth'] }],
    },
    httpRefreshToken: {
      formId: 'httpRefreshToken',
      visibleWhenAll: [
        { field: 'http.auth.type', is: ['token'] },
        { field: 'http.auth.token.location', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
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
    'http.ping.relativeURI': { fieldId: 'http.ping.relativeURI', visible: false },
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
  },
  layout: {
    type: 'boxWrapper',
    containers: [
      {
        fields: [
          'name',
          'connectionFormView',
          'application',
          'mode',
          '_agentId',
        ],
      },
      {
        containers: [
          {
            fields: [
              'http.baseURI',
              'http.updateBaseURI',
            ],
          },
          {
            type: 'indent',
            containers: [{
              fields: [],
            }],
          }],
      },
      {
        fields: [
          'http.headers',
          'http.type',
          'http.mediaType',
          'http.successMediaType',
          'http.errorMediaType',
        ],
      },
      {
        containers: [
          {
            fields: ['http.auth.type'],
          },
          {
            type: 'indent',
            containers: [{
              fields: [
                'httpBasic',
                'httpCookie',
                'httpDigest',
                'httpOAuth',
                'httpOAuthOverrides',
                'httpToken',
                'httpRefreshToken',
                'httpWsse',
              ],
            }],
          },
          {
            fields: [
              'http.auth.failStatusCode',
              'http.auth.failPath',
              'http.auth.failValues',
            ],
          },
        ],
      },
      {
        fields: [
          'http.rateLimit.limit',
          'http.rateLimit.failStatusCode',
          'http.rateLimit.failPath',
          'http.rateLimit.failValues',
          'http.retryHeader',
        ],
      },
      {
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
      id: 'saveandcontinuegroup',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
        { field: 'http.auth.oauth.grantType', is: ['clientcredentials'] },
      ],
    },
    {
      id: 'oauthandtest',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: ['oauth'],
        },
        { field: 'http.auth.oauth.grantType', isNot: ['clientcredentials'] },
      ],
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
  // refresh the baseURI as per the user input
  optionsHandler(fieldId, fields) {
    if (fieldId === 'http.baseURI') {
      const baseURIField = fields.find(field => field.id === 'http.baseURI');
      let baseURIValue = baseURIField.defaultValue;

      baseURIField.refreshOptionsOnChangesTo.forEach(fieldId => {
        const fieldValue = fields.find(field => field.id === fieldId)?.value;

        if (fieldValue) {
          baseURIValue = baseURIValue.replace(new RegExp(`{{{(.)*${fieldId}}}}`), fieldValue);
        }
      });

      return baseURIValue;
    }
  },
};

