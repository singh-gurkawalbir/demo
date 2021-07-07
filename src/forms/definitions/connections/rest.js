export default {
  preSave: formValues => {
    const newValues = { ...formValues};

    if (newValues['/mode'] === 'cloud') {
      newValues['/_agentId'] = undefined;
    }
    delete newValues['/mode'];

    if (!newValues['/rest/pingSuccessPath']) {
      newValues['/rest/pingSuccessValues'] = undefined;
    }

    if (newValues['/rest/pingMethod'] === 'GET') {
      newValues['/rest/pingBody'] = undefined;
    }

    if (newValues['/rest/encrypted']) {
      try {
        newValues['/rest/encrypted'] = JSON.parse(newValues['/rest/encrypted']);
      } catch (ex) {
        newValues['/rest/encrypted'] = undefined;
      }
    }

    if (newValues['/rest/unencrypted']) {
      try {
        newValues['/rest/unencrypted'] = JSON.parse(
          newValues['/rest/unencrypted']
        );
      } catch (ex) {
        newValues['/rest/unencrypted'] = undefined;
      }
    }

    if (newValues['/rest/authType'] !== 'basic') {
      delete newValues['/rest/basicAuth/username'];
      delete newValues['/rest/basicAuth/password'];
      newValues['/rest/basicAuth'] = undefined;
    }

    if (
      newValues['/rest/authType'] !== 'token' ||
      !formValues['/configureTokenRefresh']
    ) {
      newValues['/rest/refreshTokenMediaType'] = undefined;
      newValues['/rest/refreshTokenPath'] = undefined;
      newValues['/rest/refreshTokenHeaders'] = undefined;
      newValues['/rest/refreshTokenMethod'] = undefined;
      newValues['/rest/refreshTokenBody'] = undefined;
      newValues['/rest/refreshTokenURI'] = undefined;
    }

    if (newValues['/rest/authType'] !== 'token') {
      newValues['/rest/bearerToken'] = undefined;
      newValues['/rest/authScheme'] = undefined;
      newValues['/rest/authHeader'] = undefined;
      newValues['/rest/tokenLocation'] = undefined;
      newValues['/rest/tokenParam'] = undefined;
    }

    if (newValues['/rest/authType'] !== 'cookie') {
      if (newValues['/rest/cookieAuth/method'] === 'GET') {
        newValues['/rest/cookieAuth/body'] = undefined;
      }
    }

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
            { label: 'On-premise', value: 'onpremise' },
          ],
        },
      ],
    },
    _agentId: {
      fieldId: '_agentId',
      visibleWhen: [{ field: 'mode', is: ['onpremise'] }],
    },
    'rest.authType': { fieldId: 'rest.authType', required: true },
    'rest.headers': {
      fieldId: 'rest.headers',
    },
    'rest.baseURI': {
      fieldId: 'rest.baseURI',
      required: true,
    },
    'rest.mediaType': {
      fieldId: 'rest.mediaType',
      required: true,
    },
    'rest.encrypted': {
      fieldId: 'rest.encrypted',
      label: 'Custom encrypted fields',
      helpKey: 'connection.http.encrypted',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['custom'] },
        { field: 'rest.authType', isNot: [''] },
      ],
      defaultValue: '{"field": "value"}',
    },
    'rest.unencrypted': {
      fieldId: 'rest.unencrypted',
      label: 'Custom unencrypted fields',
      helpKey: 'connection.http.unencrypted',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['custom'] },
        { field: 'rest.authType', isNot: [''] },
      ],
      defaultValue: r =>
        r && r.rest && r.rest.unencrypted && JSON.stringify(r.rest.unencrypted),
    },
    restBasic: {
      formId: 'restBasic',
      visibleWhenAll: [{ field: 'rest.authType', is: ['basic'] }],
    },
    'rest.disableStrictSSL': { fieldId: 'rest.disableStrictSSL' },
    restToken: {
      formId: 'restToken',
      visibleWhenAll: [{ field: 'rest.authType', is: ['token'] }],
    },
    restRefreshToken: {
      formId: 'restRefreshToken',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['token'] },
        { field: 'rest.tokenLocation', isNot: [''] },
        { field: 'configureTokenRefresh', is: [true] },
      ],
    },
    restCookie: {
      formId: 'restCookie',
      visibleWhenAll: [{ field: 'rest.authType', is: ['cookie'] }],
    },
    'rest.pingMethod': { fieldId: 'rest.pingMethod' },
    'rest.pingBody': {
      fieldId: 'rest.pingBody',
      visibleWhenAll: [{ field: 'rest.pingMethod', is: ['POST'] }],
    },
    'rest.pingRelativeURI': { fieldId: 'rest.pingRelativeURI' },
    'rest.pingSuccessPath': { fieldId: 'rest.pingSuccessPath' },
    'rest.pingSuccessValues': { fieldId: 'rest.pingSuccessValues' },
    restAdvanced: { formId: 'restAdvanced' },
    application: {
      fieldId: 'application',
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
          'rest.baseURI',
          'rest.headers',
          'rest.mediaType',
        ],
      },
      {
        collapsed: true,
        label: 'Configure authentication',
        fields: ['rest.authType'],
        type: 'collapse',
        containers: [
          {
            collapsed: true,
            label: 'Configure basic auth',
            fields: [
              'restBasic',
            ],
          },
          {
            collapsed: true,
            label: 'Configure cookie auth',
            fields: [
              'restCookie',
            ],
          },
          {
            collapsed: false,
            label: 'Configure custom auth',
            fields: [
              'rest.encrypted',
              'rest.unencrypted',
            ],
          },
          {
            collapsed: true,
            label: 'Configure token auth',
            fields: [
              'restToken',
            ],
          },
          {
            collapsed: true,
            label: 'Configure refresh token',
            fields: ['restRefreshToken'],
          },
        ],
      },
      {
        collapsed: true,
        label: 'How to test this connection?',
        fields: [
          'rest.pingMethod',
          'rest.pingRelativeURI',
          'rest.pingBody',
          'rest.pingSuccessPath',
          'rest.pingSuccessValues',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced',
        fields: ['rest.disableStrictSSL', 'restAdvanced'],
      },
    ],
  },
};
