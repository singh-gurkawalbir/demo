export default {
  fields: [
    // #region Main
    // name
    {
      fieldId: 'connection.name',
    },

    // baseURI
    {
      fieldId: 'connection.http.baseURI',
    },

    // media type
    {
      fieldId: 'mediaType',
    },

    // header
    {
      fieldId: 'HttpHeader',
    },
    // #endregion
  ],
  fieldSets: [
    {
      header: 'Authentication',
      collapsed: false,
      fields: [
        // #region Auth
        // auth type
        {
          fieldId: 'AuthenticationType',
        },

        // auth fail code
        {
          fieldId: 'AuthFailStatusCode',
        },

        // auth fail path
        {
          fieldId: 'AuthenticationFailPath',
        },

        // auth fail values
        {
          fieldId: 'AuthenticationFailValues',
        },

        // unencrypted
        {
          fieldId: 'Unencrypted',
        },

        // encrypted
        {
          fieldId: 'Encrypted',
        },
        // #endregion
      ],
    },
    {
      header: 'Ping Configuration',
      collapsed: true,
      fields: [
        // #region PING
        // Ping Relative URI:
        {
          fieldId: 'PingRelativeURI',
        },

        // Ping Method:
        {
          fieldId: 'PingMethod',
        },

        // Ping Success Path:
        {
          fieldId: 'PingSuccessPath',
        },

        // Ping Success Values:
        {
          fieldId: 'PingSuccessValues',
        },

        // Ping Error Path
        {
          fieldId: 'PingErrorPath',
        },
        // #endregion
      ],
    },
    {
      header: 'API Rate Limits Configuration (optional)',
      collapsed: true,
      fields: [
        // #region API Rate Limits
        // Limit
        {
          fieldId: 'Limit',
        },

        // Fail Status Code:
        {
          fieldId: 'LimitStatusCode',
        },

        // Fail Path:
        {
          fieldId: 'RateLimitFailPath',
        },

        // Fail Values:
        {
          fieldId: 'RateLimitFailValues',
        },

        // Retry Header:
        {
          fieldId: 'LimitRetryHeader',
        },
        // #endregion
      ],
    },
    {
      header: 'Refresh Token Configuration (optional)',
      collapsed: true,
      fields: [
        // #region Refresh Token
        // RefreshToken
        {
          fieldId: 'RefreshToken',
        },

        // RefreshRelativeURI:
        {
          fieldId: 'RefreshRelativeURI',
        },

        // RefreshMediaType:
        {
          fieldId: 'RefreshMediaType',
        },

        // RefreshMethod:
        {
          fieldId: 'RefreshMethod',
        },

        // RefreshBody
        {
          fieldId: 'RefreshBody',
        },
        // RefreshTokenPath:
        {
          fieldId: 'RefreshTokenPath',
        },
        // #endregion
      ],
    },
    {
      header: 'Advanced (optional)',
      collapsed: true,
      fields: [
        // #region Advanced
        // Disable Strict SSL:
        {
          fieldId: 'DisableStrictSSL',
        },

        // Borrow Concurrency From:
        {
          fieldId: 'BorrowConcurrencyFrom',
        },

        // Concurrency Level:
        {
          fieldId: 'ConcurrencyLevel',
        },
        // #endregion
      ],
    },
  ],
};
