export default {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  'oauth2.clientId': {
    type: 'text',
    label: 'Client Id',
    required: true,
  },
  'oauth2.clientSecret': {
    type: 'text',
    label: 'Client Secret',
    inputType: 'password',
    defaultValue: '',
    required: true,
  },
};
