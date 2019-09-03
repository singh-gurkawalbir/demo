export default {
  fields: [
    {
      fieldId: 'rest.bearerToken',
      label: 'Token:',
      defaultValue: '',
      required: true,
    },
    {
      id: 'tokenHeader',
      label: 'How to send token?',
      type: 'labeltitle',
    },
    {
      fieldId: 'rest.tokenLocation',
      required: true,
    },
    {
      fieldId: 'rest.authHeader',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          is: ['header'],
        },
      ],
      defaultValue: r => (r && r.rest && r.rest.authHeader) || 'Authorization',
    },
    {
      fieldId: 'rest.authScheme',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          is: ['header'],
        },
      ],
      defaultValue: r => (r && r.rest && r.rest.authScheme) || 'Bearer',
    },
    {
      fieldId: 'rest.tokenParam',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          is: ['url'],
        },
      ],
    },
    {
      fieldId: 'configureTokenRefresh',
      type: 'checkbox',
      label: 'Configure Token Refresh:',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          isNot: [''],
        },
      ],
      defaultValue: r => !!(r && r.rest && r.rest.refreshTokenURI),
    },
    {
      id: 'refreshTokenHeader',
      label: 'How to Refresh Token?',
      type: 'labeltitle',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'rest.refreshTokenURI',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'rest.refreshTokenMediaType',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'rest.refreshTokenMethod',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'rest.refreshTokenBody',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
        {
          field: 'rest.refreshTokenMethod',
          is: ['POST', 'PUT'],
        },
      ],
    },
    {
      fieldId: 'rest.refreshTokenPath',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'rest.refreshTokenHeaders',
      visibleWhenAll: [
        {
          field: 'rest.tokenLocation',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
  ],
  fieldSets: [],
};
