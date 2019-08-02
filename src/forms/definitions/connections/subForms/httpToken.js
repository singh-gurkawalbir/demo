export default {
  fields: [
    {
      fieldId: 'http.auth.token.token',
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
      fieldId: 'http.auth.token.location',
      required: true,
    },
    {
      fieldId: 'http.auth.token.headerName',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          is: ['header'],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.scheme',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          is: ['header'],
        },
      ],
    },
    {
      id: 'http.customAuthScheme',
      type: 'text',
      label: 'Custom Auth Scheme:',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          is: ['header'],
        },
        {
          field: 'http.auth.token.scheme',
          is: ['Custom'],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.paramName',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
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
          field: 'http.auth.token.location',
          isNot: [''],
        },
      ],
      defaultValue: r =>
        !!((((r && r.http) || {}).auth || {}).token || {}).refreshToken,
    },
    {
      id: 'refreshTokenHeader',
      label: 'How to Refresh Token?',
      type: 'labeltitle',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.refreshToken',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.refreshRelativeURI',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.refreshMediaType',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.refreshMethod',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.refreshBody',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.refreshTokenPath',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
          isNot: [''],
        },
        {
          field: 'configureTokenRefresh',
          is: [true],
        },
      ],
    },
    {
      fieldId: 'http.auth.token.refreshHeaders',
      visibleWhenAll: [
        {
          field: 'http.auth.token.location',
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
