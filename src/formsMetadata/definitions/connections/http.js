// {
//   header: 'xy',
//   collapsed: true|false,
//   fields: [{},{}],
// }

export default [
  // #region Common
  // name
  {
    id: 'Name',
    name: '/name',
    type: 'text',
    label: 'Name',
    description: 'this is the description',
    placeholder: '',
    defaultValue: '',
    options: [],
    visible: true,
    required: true,
    disabled: false,
    visibleWhen: [],
    requiredWhen: [],
    disabledWhen: [],
    omitWhenHidden: true,
    valueDelimiter: '',
    useChangesAsValues: false,
    shouldMatchRegex: false,
    hasMinLength: false,
    hasMaxLength: false,
    hasNumericalRange: false,
    shouldCompareTo: false,
  },

  // description
  {
    id: 'description',
    name: '/description',
    type: 'textarea',
    label: 'Description',
    description: '',
    placeholder: '',
    defaultValue: '',
  },
  // #endregion

  // #region Basic
  // auth type
  {
    id: 'AuthenticationType',
    name: 'http/auth/type',
    type: 'select',
    label: 'Authentication Type',
    description: '',
    placeholder: '',
    defaultValue: '',
    options: [
      {
        items: [
          {
            label: 'Custom',
            value: 'custom',
          },
          {
            label: 'Basic',
            value: 'basic',
          },
          {
            label: 'Token',
            value: 'token',
          },
        ],
      },
    ],
    visible: true,
    required: false,
    disabled: false,
    visibleWhen: [],
    requiredWhen: [],
    disabledWhen: [],
    shouldMatchRegex: false,
    hasMinLength: false,
    hasMaxLength: false,
    hasNumericalRange: false,
    shouldCompareTo: false,
    omitWhenHidden: false,
    valueDelimiter: '',
    useChangesAsValues: false,
  },

  // auth fail code
  {
    id: 'AuthFailStatusCode',
    name: '/http/auth/failStatusCode',
    type: 'text',
    label: 'Authentication Fail Status Code',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // auth fail path
  {
    id: 'AuthenticationFailPath ',
    name: '/http/auth/failPath',
    type: 'text',
    label: 'Authentication Fail Path',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // auth fail values
  {
    id: 'AuthenticationFailValues',
    name: '/http/auth/failValues',
    type: 'text',
    label: 'Authentication Fail Values',
    description: 'Separate multiple values with commas.',
    placeholder: 'optional',
    defaultValue: '',
  },

  // baseURI
  {
    id: 'baseURI',
    name: '/http/baseURI',
    type: 'text',
    label: 'Base URI',
    description: '',
    placeholder: '',
    defaultValue: '',
    required: true,
    validWhen: {
      lengthIsGreaterThan: {
        length: 3,
        message: 'The value must have more than 3 characterrs',
      },
      lengthIsLessThan: {
        length: 6,
        message: 'The value must less than 6 characters',
      },
      fallsWithinNumericalRange: {
        min: 150,
        max: 80000,
        message: 'The value must be more than 150 and less than 80000',
      },
      matchesRegEx: {
        pattern: '^[\\d]+$',
        message: 'Only numbers allowed',
      },
      isNot: {
        values: ['2500', '4001'],
        message: 'The value cannot be 2500 nor 4001',
      },
    },
  },

  // media type
  {
    id: 'mediaType',
    name: '/http/mediaType',
    type: 'select',
    label: 'Media Type',
    description: '',
    placeholder: '',
    defaultValue: '',
    options: [
      {
        items: [
          {
            label: 'JSON',
            value: 'json',
          },
          {
            label: 'XML',
            value: 'xml',
          },
        ],
      },
    ],
    visible: true,
    required: true,
  },

  // unencrypted
  {
    id: 'Unencrypted',
    name: 'http/unencrypted',
    type: 'textarea',
    label: 'Unencrypted',
    description: 'Place any non sesitive connetion information here.',
    placeholder: '{"field": "value"}',
    defaultValue: '',
  },

  // encrypted
  {
    id: 'Encrypted',
    name: 'http/encrypted',
    type: 'textarea',
    label: 'Unencrypted',
    description: 'Place your sesitive connetion information here.',
    placeholder: '{"field": "value"}',
    defaultValue: '',
  },
  // #endregion

  // #region API Rate Limits
  // Limit
  {
    id: 'Limit',
    name: '/http/rateLimit/limit',
    type: 'text',
    label: 'Limit',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // Fail Status Code:
  {
    id: 'LimitStatusCode',
    name: '/http/rateLimit/failStatusCode',
    type: 'text',
    label: 'Fail Status Code',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // Fail Path:
  {
    id: 'RateLimitFailPath',
    name: '/http/rateLimit/failPath',
    type: 'text',
    label: 'Fail Path',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // Fail Values:
  {
    id: 'RateLimitFailValues',
    name: 'http/rateLimit/failValues',
    type: 'text',
    label: 'Fail Values',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // Retry Header:
  {
    id: 'LimitRetryHeader',
    name: 'http/rateLimit/retryHeader',
    type: 'text',
    label: 'Retry Header',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },
  // #endregion

  // #region PING
  // Ping Relative URI:
  {
    id: 'PingRelativeURI',
    name: '/http/ping/relativeURI',
    type: 'text',
    label: 'Relative URI',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // Ping Method:
  {
    id: 'PingMethod',
    name: '/http/ping/method',
    type: 'select',
    label: 'Ping Method',
    description: '',
    options: [
      {
        items: ['GET', 'PUT', 'POST'],
      },
    ],
    defaultValue: '',
  },

  // Ping Success Path:
  {
    id: 'PingSuccessPath',
    name: '/http/ping/successPath',
    type: 'text',
    label: 'Success Path',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // Ping Success Values:
  {
    id: 'PingSuccessValues',
    name: '/http/ping/successValues',
    type: 'text',
    label: 'Success Values',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },

  // Ping Error Path
  {
    id: 'PingErrorPath',
    name: '/http/ping/errorPath',
    type: 'text',
    label: 'Error Path',
    description: '',
    placeholder: 'optional',
    defaultValue: '',
  },
  // #endregion
];
