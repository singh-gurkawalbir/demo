export default {
  name: {
    type: 'text',
    label: 'Name',
    required: true,
  },
  'oauth2.clientId': {
    type: 'text',
    label: 'Client Id',
    helpText:
      'This is the ID for your client app that is registered with the API provider.',
    required: true,
  },
  'oauth2.clientSecret': {
    type: 'text',
    label: 'Client Secret',
    inputType: 'password',
    defaultValue: '',
    helpText: 'This is the client secret the API provider gave you.',
    required: true,
  },
};
