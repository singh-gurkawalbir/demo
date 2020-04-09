export default {
  name: {
    type: 'text',
    label: 'Name',
  },
  'salesforce.username': {
    type: 'text',
    label: 'Username',
  },
  'salesforce.password': {
    type: 'text',
    inputType: 'password',
    label: 'Password',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'salesforce.securityKey': {
    type: 'text',
    inputType: 'password',
    label: 'Security Token',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
  'salesforce.sandbox': {
    type: 'select',
    label: 'Account Type',
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
  },
  'sears.username': {
    type: 'text',
    label: 'Username',
  },
  'sears.password': {
    type: 'text',
    inputType: 'password',
    label: 'Secret Key',
    defaultValue: '',
    description:
      'Note: for security reasons this field must always be re-entered.',
  },
};
