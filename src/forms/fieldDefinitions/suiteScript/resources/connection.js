export default {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  'salesforce.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'salesforce.password': {
    type: 'text',
    inputType: 'password',
    label: 'Password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'salesforce.securityKey': {
    type: 'text',
    inputType: 'password',
    label: 'Security token',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'salesforce.sandbox': {
    type: 'select',
    label: 'Account type',
    required: true,
    options: [
      {
        items: [
          { label: 'Production', value: false },
          { label: 'Sandbox', value: true },
        ],
      },
    ],
  },
  'sears.sellerId': {
    type: 'text',
    label: 'Seller id',
    required: true,
  },
  'sears.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'sears.password': {
    type: 'text',
    inputType: 'password',
    label: 'Secret key',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.hostURI': {
    type: 'text',
    label: 'Host',
    required: true,
  },
  'ftp.useSFTP': {
    type: 'checkbox',
    label: 'Use SFTP',
    defaultValue: r => !!(r && r.type === 'sftp'),
  },
  'ftp.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'ftp.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    requiredWhen: [
      {
        field: 'ftp.useSFTP',
        is: [false],
      },
      {
        field: 'ftp.authKey',
        is: [''],
      },
    ],
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ftp.authKey': {
    type: 'text',
    label: 'Authentication key (pem format)',
    placeholder: 'Optional if password is entered',
    multiline: true,
    defaultValue: '',
    visibleWhen: [
      {
        field: 'ftp.useSFTP',
        is: [true],
      },
    ],
  },
  'ftp.usePassiveMode': {
    type: 'checkbox',
    label: 'Use passive mode',
    defaultValue: r => !!(r && r.ftp && r.ftp.usePassiveMode),
  },
  'ftp.userDirectoryIsRoot': {
    type: 'checkbox',
    label: 'User directory is root',
    defaultValue: r => !!(r && r.ftp && r.ftp.userDirectoryIsRoot),
  },
  'ofxserver.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'ofxserver.password': {
    type: 'text',
    label: 'Pin',
    inputType: 'password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ofxserver.sandbox': {
    type: 'select',
    label: 'OFX server type',
    required: true,
    options: [
      {
        items: [
          { label: 'Production', value: false },
          { label: 'UAT', value: true },
        ],
      },
    ],
  },
  'magento.hostURI': {
    type: 'text',
    label: 'SOAP url:',
    required: true,
  },
  'magento.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'magento.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'rakuten.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'rakuten.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'newegg.username': {
    type: 'text',
    label: 'Seller id',
    required: true,
  },
  'newegg.password': {
    type: 'text',
    label: 'Secret key',
    inputType: 'password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'newegg.securityKey': {
    type: 'text',
    label: 'API key',
    inputType: 'password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'netsuite.authType': {
    type: 'select',
    label: 'Authentication type',
    required: true,
    options: [
      {
        items: [
          { label: 'Basic', value: 'basic' },
          { label: 'Token', value: 'token' },
        ],
      },
    ],
    defaultValue: r => (r && r.netsuite && r.netsuite.authType) || 'basic',
    defaultDisabled: r => r.id === 'CELIGO_JAVA_INTEGRATOR_NETSUITE_CONNECTION',
  },
  'netsuite.role': {
    type: 'text',
    label: 'Role id',
    required: true,
    visibleWhen: [
      {
        field: 'netsuite.authType',
        is: ['basic'],
      },
    ],
  },
  'netsuite.email': {
    type: 'text',
    label: 'Email',
    required: true,
    visibleWhen: [
      {
        field: 'netsuite.authType',
        is: ['basic'],
      },
    ],
  },
  'netsuite.password': {
    type: 'text',
    inputType: 'password',
    label: 'Password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    visibleWhen: [
      {
        field: 'netsuite.authType',
        is: ['basic'],
      },
    ],
  },
  'netsuite.consumerKey': {
    type: 'text',
    inputType: 'password',
    label: 'Consumer key',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    visibleWhen: [
      {
        field: 'netsuite.authType',
        is: ['token'],
      },
    ],
  },
  'netsuite.consumerSecret': {
    type: 'text',
    inputType: 'password',
    label: 'Consumer secret',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    visibleWhen: [
      {
        field: 'netsuite.authType',
        is: ['token'],
      },
    ],
  },
  'netsuite.tokenId': {
    type: 'text',
    inputType: 'password',
    label: 'Token id',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    visibleWhen: [
      {
        field: 'netsuite.authType',
        is: ['token'],
      },
    ],
  },
  'netsuite.tokenSecret': {
    type: 'text',
    inputType: 'password',
    label: 'Token secret',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
    visibleWhen: [
      {
        field: 'netsuite.authType',
        is: ['token'],
      },
    ],
  },
  'other.hostURI': {
    type: 'text',
    label: 'Address',
    required: true,
  },
  'other.username': {
    type: 'text',
    label: 'Username',
    required: true,
  },
  'other.password': {
    type: 'text',
    label: 'Password',
    inputType: 'password',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'ebay.notSupported': {
    type: 'labeltitle',
    label:
      'Editing an eBay connection is not supported at this time. Please navigate to your SuiteScript integrator in NetSuite to edit this connection.',
  },
};
