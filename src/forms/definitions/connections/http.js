export default {
  preSubmit: formValues => {
    const newValues = Object.assign({}, formValues);

    if (!newValues['/configureApiRateLimits']) {
      newValues['/http/rateLimit/limit'] = undefined;
      newValues['/http/rateLimit/failValues'] = undefined;
      newValues['/http/rateLimit/failPath'] = undefined;
      newValues['/http/rateLimit/failStatusCode'] = undefined;
      newValues['/http/rateLimit/retryHeader'] = undefined;
    }

    if (!newValues['/http/ping/successPath']) {
      newValues['/http/ping/successValues'] = undefined;
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
      newValues['/http/auth/basic/username'] = undefined;
      newValues['/http/auth/basic/password'] = undefined;
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
  fields: [
    { fieldId: 'type' },
    { fieldId: 'name' },
    { fieldId: 'http.auth.type', required: true },
    {
      fieldId: 'http.headers',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          isNot: [''],
        },
      ],
    },
    { fieldId: 'http.baseURI', required: true },
    { fieldId: 'http.mediaType', required: true },
    {
      fieldId: 'http.encrypted',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: ['token', 'custom'],
        },
      ],
      defaultValue: '{"field": "value"}',
    },
    {
      fieldId: 'http.unencrypted',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: ['token', 'custom'],
        },
      ],
      defaultValue: r =>
        r && r.http && r.http.unencrypted && JSON.stringify(r.http.unencrypted),
    },
    {
      formId: 'httpBasic',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: ['basic'],
        },
      ],
    },
    {
      formId: 'httpToken',
      visibleWhenAll: [
        {
          field: 'http.auth.type',
          is: ['token'],
        },
      ],
    },
    {
      fieldId: 'configureApiRateLimits',
    },
    {
      fieldId: 'http.rateLimits',
      visible: false,
      visibleWhenAll: [
        {
          field: 'configureApiRateLimits',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.rateLimit.limit',
      visibleWhenAll: [
        {
          field: 'configureApiRateLimits',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.rateLimit.failStatusCode',
      visibleWhenAll: [
        {
          field: 'configureApiRateLimits',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.rateLimit.failValues',
      visibleWhenAll: [
        {
          field: 'configureApiRateLimits',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.retryHeader',
      visibleWhenAll: [
        {
          field: 'configureApiRateLimits',
          is: [true],
        },
      ],
    },
  ],
  fieldSets: [
    {
      header: 'How to test connection?',
      collapsed: false,
      fields: [
        { fieldId: 'http.ping.relativeURI' },
        { fieldId: 'http.ping.method' },
        {
          fieldId: 'http.ping.body',
          visibleWhenAll: [
            {
              field: 'http.ping.method',
              is: ['POST', 'PUT'],
            },
          ],
        },
        { fieldId: 'http.ping.successPath' },
        { fieldId: 'http.ping.successValues' },
        { fieldId: 'http.ping.errorPath' },
      ],
    },
  ],
};
