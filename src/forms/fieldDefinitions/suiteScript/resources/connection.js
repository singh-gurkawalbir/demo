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
    label: 'Security Token',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'salesforce.sandbox': {
    type: 'select',
    label: 'Account Type',
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
    label: 'Seller Id',
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
    label: 'Secret Key',
    required: true,
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
};
