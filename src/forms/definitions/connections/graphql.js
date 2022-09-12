import { convertGraphQLQueryToHTTPBody, getGraphqlRelativeURI } from '../../../utils/graphql';
import http from './http';

export default {
  preSave: formValues => {
    const newValues = {...formValues};

    newValues['/type'] = 'http';
    newValues['/http/formType'] = 'graph_ql';
    newValues['/http/mediaType'] = 'json';
    newValues['/http/ping/body'] = convertGraphQLQueryToHTTPBody({
      query: newValues['/graphql/query'],
      variables: newValues['/graphql/variables'],
      operationName: newValues['/graphql/operationName'],
    });
    if (newValues['/http/ping/method'] === 'GET') {
      newValues['/http/ping/body'] = undefined;
      newValues['/http/ping/relativeURI'] = getGraphqlRelativeURI({
        query: newValues['/graphql/query'],
        variables: newValues['/graphql/variables'],
        operationName: newValues['/graphql/operationName'],
      });
    }
    if (newValues['/http/ping/method'] === 'POST') {
      newValues['/http/ping/relativeURI'] = undefined;
    }
    delete newValues['/graphql/query'];
    delete newValues['/graphql/operationName'];
    delete newValues['/graphql/variables'];

    return http.preSave(newValues);
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
      helpKey: 'graphql.baseURI',
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
    graphql: {
      formId: 'graphql',
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
                label: 'OAuth 2.0 overrides',
                fields: [
                  'httpOAuthOverrides',
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
            ],
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
        fields: ['graphql'],
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
};

