export default {
  name: {
    loggable: true,
    type: 'text',
    label: 'Name',
    required: true,
  },
  'oauth2.clientId': {
    type: 'text',
    label: 'Client ID',
    required: true,
    visible: r => ![r.provider, r.assistant].includes('amazonmws'),
  },
  'oauth2.clientSecret': {
    type: 'text',
    label: 'Client secret',
    description:
        'Note: for security reasons this field must always be re-entered',
    inputType: 'password',
    defaultValue: '',
    required: true,
    visible: r => ![r.provider, r.assistant].includes('amazonmws'),
  },
  'amazonmws.accessKeyId': {
    type: 'text',
    label: 'Access key ID:',
    required: true,
    visible: r => [r.provider, r.assistant].includes('amazonmws'),
  },
  'amazonmws.secretKey': {
    type: 'text',
    label: 'Secret key:',
    description:
        'Note: for security reasons this field must always be re-entered',
    defaultValue: '',
    required: true,
    visible: r => [r.provider, r.assistant].includes('amazonmws'),
  },
};
