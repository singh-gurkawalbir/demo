export default {
  preSave: formValues => {
    const pingData = {
      profile_id: formValues['/http/unencrypted/profileId'],
      profile_key: formValues['/http/encrypted/profileKey'],
      transaction_type: 'D',
      card_number: formValues['/http/encrypted/cardNumber'],
      transaction_amount: '151',
      resp_encoding: 'json',
    };

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'merchantesolutions',
      '/http/auth/type': 'custom',
      '/http/mediaType': 'urlencoded',
      '/http/baseURI': `https://cert.merchante-solutions.com`,
      '/http/ping/relativeURI': '/mes-api/tridentApi',
      '/http/ping/method': 'POST',
      '/http/ping/successValues': ['000'],
      '/http/ping/successPath': 'error_code',
      '/http/ping/body': JSON.stringify(pingData),
      '/http/headers': [
        { name: 'content-type', value: 'application/x-www-form-urlencoded' },
      ],
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'http.unencrypted.profileId': {
      id: 'http.unencrypted.profileId',
      type: 'text',
      label: 'Profile ID',
      required: true,
      helpText: 'ID (Profile ID) issued by Merchant e-Solutions.',
    },
    'http.encrypted.profileKey': {
      id: 'http.encrypted.profileKey',
      type: 'text',
      label: 'Profile Key',
      required: true,
      defaultValue: '',
      inputType: 'password',
      helpText: 'API password (Profile Key) assigned by Merchant e-Solutions.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.cardNumber': {
      id: 'http.encrypted.cardNumber',
      type: 'text',
      label: 'Card Number',
      required: true,
      inputType: 'password',
      defaultValue: '',
      helpText: 'Payment card number.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'http.unencrypted.profileId',
      'http.encrypted.profileKey',
      'http.encrypted.cardNumber',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['httpAdvanced'] },
    ],
  },
};
