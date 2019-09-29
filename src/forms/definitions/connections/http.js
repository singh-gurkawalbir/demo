export default {
  preSave: formValues => {
    const newValues = Object.assign({}, formValues);

    if (!newValues['/http/ping/successPath']) {
      newValues['/http/ping/successValues'] = undefined;
    }

    if (!newValues['/http/ratLimit/failPath']) {
      newValues['/http/rateLimit/failValues'] = undefined;
    }

    if (newValues['/http/ping/method'] === 'GET') {
      newValues['/http/ping/body'] = undefined;
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

    if (newValues['/http/auth/type'] !== 'basic') {
      newValues['/http/auth/basic'] = undefined;
    }

    if (
      newValues['/http/auth/type'] !== 'token' ||
      !formValues['/configureTokenRefresh']
    ) {
      newValues['/http/auth/token/refreshMethod'] = undefined;
      newValues['/http/auth/token/refreshTokenPath'] = undefined;
      newValues['/http/auth/token/refreshTokenHeaders'] = undefined;
      newValues['/http/auth/token/refreshToken'] = undefined;
      newValues['/http/auth/token/refreshBody'] = undefined;
      newValues['/http/auth/token/refreshRelativeURI'] = undefined;
      newValues['/http/auth/token/refreshMediaType'] = undefined;
    }

    if (newValues['/http/auth/type'] === 'token') {
      if (newValues['/http/auth/token/scheme'] === 'Custom') {
        newValues['/http/auth/token/scheme'] =
          newValues['/http/customAuthScheme'];
      }
    }

    if (newValues['/http/auth/type'] !== 'token') {
      newValues['/http/auth/token'] = {};
    }

    return newValues;
  },
  fieldMap: {
    name: { fieldId: 'name' },
    mode: {
      id: 'mode',
      type: 'radiogroup',
      label: 'Mode:',
      defaultValue: 'cloud',
      options: [
        {
          items: [
            { label: 'Cloud', value: 'cloud' },
            { label: 'On-Premise', value: 'onpremise' },
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
      visibleWhenAll: [{ field: 'http.auth.type', isNot: [''] }],
    },
    'http.auth.failStatusCode': { fieldId: 'http.auth.failStatusCode' },
    'http.auth.failPath': { fieldId: 'http.auth.failPath' },
    'http.auth.failValues': { fieldId: 'http.auth.failValues' },
    'http.baseURI': { fieldId: 'http.baseURI' },
    'http.mediaType': { fieldId: 'http.mediaType' },
    'http.encrypted': {
      fieldId: 'http.encrypted',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['token', 'custom'] }],
      defaultValue: r =>
        (r && r.http && r.http.encrypted && JSON.stringify(r.http.encrypted)) ||
        '{"field": "value"}',
    },
    'http.unencrypted': {
      fieldId: 'http.unencrypted',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['token', 'custom'] }],
      defaultValue: r =>
        (r &&
          r.http &&
          r.http.unencrypted &&
          JSON.stringify(r.http.unencrypted)) ||
        '{"field": "value"}',
    },
    httpBasic: {
      formId: 'httpBasic',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['basic'] }],
    },
    httpToken: {
      formId: 'httpToken',
      visibleWhenAll: [{ field: 'http.auth.type', is: ['token'] }],
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
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'mode',
      '_agentId',
      'http.auth.type',
      'http.headers',
      'http.auth.failStatusCode',
      'http.auth.failPath',
      'http.auth.failValues',
      'http.baseURI',
      'http.mediaType',
      'http.encrypted',
      'http.unencrypted',
      'httpBasic',
      'httpToken',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: false,
        label: 'API Rate Limits',
        fields: [
          'http.rateLimit.limit',
          'http.rateLimit.failStatusCode',
          'http.rateLimit.failPath',
          'http.rateLimit.failValues',
          'http.retryHeader',
        ],
      },
      {
        collapsed: false,
        label: 'How to test connection?',
        fields: [
          'http.ping.relativeURI',
          'http.ping.method',
          'http.ping.body',
          'http.ping.successPath',
          'http.ping.successValues',
          'http.ping.errorPath',
        ],
      },
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
