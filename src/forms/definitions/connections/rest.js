export default {
  preSave: formValues => {
    const newValues = { ...formValues};

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
      // newValues['/rest/auth/token/refreshMediaType'] = undefined;
    }

    if (newValues['/rest/authType'] !== 'token') {
      newValues['/rest/bearerToken'] = undefined;
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
            { label: 'On-Premise', value: 'onpremise' },
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
      visibleWhenAll: [{ field: 'rest.authType', isNot: [''] }],
    },
    'rest.baseURI': {
      fieldId: 'rest.baseURI',
      required: true,
      visibleWhenAll: [{ field: 'rest.authType', isNot: [''] }],
    },
    'rest.mediaType': {
      fieldId: 'rest.mediaType',
      required: true,
      visibleWhenAll: [{ field: 'rest.authType', isNot: [''] }],
    },
    'rest.encrypted': {
      fieldId: 'rest.encrypted',
      visibleWhenAll: [
        { field: 'rest.authType', is: ['custom'] },
        { field: 'rest.authType', isNot: [''] },
      ],
      defaultValue: '{"field": "value"}',
    },
    'rest.unencrypted': {
      fieldId: 'rest.unencrypted',
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
  },
  layout: {
    fields: [
      'name',
      'mode',
      '_agentId',
      'rest.authType',
      'rest.headers',
      'rest.baseURI',
      'rest.mediaType',
      'rest.encrypted',
      'rest.unencrypted',
      'restBasic',
      'restToken',
      'restCookie',
    ],
    type: 'collapse',
    containers: [
      {
        collapsed: true,
        label: 'How to test connection?',
        fields: [
          'rest.pingMethod',
          'rest.pingBody',
          'rest.pingRelativeURI',
          'rest.pingSuccessPath',
          'rest.pingSuccessValues',
        ],
      },
      {
        collapsed: true,
        label: 'Advanced Settings',
        fields: ['rest.disableStrictSSL', 'restAdvanced'],
      },
    ],
  },
};
