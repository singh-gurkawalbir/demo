export default {
  fields: [
    // #region Main
    // name
    {
      id: 'ConnectionName',
    },

    // baseURI
    {
      id: 'baseURI',
    },

    // media type
    {
      id: 'mediaType',
    },

    // header
    {
      id: 'HttpHeader',
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
          id: 'AuthenticationType',
        },

        // auth fail code
        {
          id: 'AuthFailStatusCode',
        },

        // auth fail path
        {
          id: 'AuthenticationFailPath ',
        },

        // auth fail values
        {
          id: 'AuthenticationFailValues',
        },

        // unencrypted
        {
          id: 'Unencrypted',
        },

        // encrypted
        {
          id: 'Encrypted',
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
          id: 'PingRelativeURI',
        },

        // Ping Method:
        {
          id: 'PingMethod',
        },

        // Ping Success Path:
        {
          id: 'PingSuccessPath',
        },

        // Ping Success Values:
        {
          id: 'PingSuccessValues',
        },

        // Ping Error Path
        {
          id: 'PingErrorPath',
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
          id: 'Limit',
        },

        // Fail Status Code:
        {
          id: 'LimitStatusCode',
        },

        // Fail Path:
        {
          id: 'RateLimitFailPath',
        },

        // Fail Values:
        {
          id: 'RateLimitFailValues',
        },

        // Retry Header:
        {
          id: 'LimitRetryHeader',
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
          id: 'RefreshToken',
        },

        // RefreshRelativeURI:
        {
          id: 'RefreshRelativeURI',
        },

        // RefreshMediaType:
        {
          id: 'RefreshMediaType',
        },

        // RefreshMethod:
        {
          id: 'RefreshMethod',
        },

        // RefreshBody
        {
          id: 'RefreshBody',
        },
        // RefreshTokenPath:
        {
          id: 'RefreshTokenPath',
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
          id: 'DisableStrictSSL',
        },

        // Borrow Concurrency From:
        {
          id: 'BorrowConcurrencyFrom',
        },

        // Concurrency Level:
        {
          id: 'ConcurrencyLevel',
        },
        // #endregion
      ],
    },
  ],
};
