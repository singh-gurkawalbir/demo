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
    visible: r => ![r.provider, r.assistant].includes('amazonmws'),
  },
  'oauth2.clientSecret': {
    type: 'text',
    label: 'Client Secret',
    inputType: 'password',
    defaultValue: '',
    helpText: 'This is the client secret the API provider gave you.',
    required: true,
    visible: r => ![r.provider, r.assistant].includes('amazonmws'),
  },
  'amazonmws.accessKeyId': {
    type: 'text',
    label: 'Access Key Id:',
    required: true,
    visible: r => [r.provider, r.assistant].includes('amazonmws'),
  },
  'amazonmws.secretKey': {
    type: 'text',
    label: 'Secret Key:',
    defaultValue: '',
    required: true,
    visible: r => [r.provider, r.assistant].includes('amazonmws'),
  },
};
