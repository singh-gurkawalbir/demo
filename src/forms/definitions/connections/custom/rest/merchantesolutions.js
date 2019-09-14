export default {
  preSubmit: formValues => {
    const pingData = {
      profile_id: formValues['/rest/unencrypted/profileId'],
      profile_key: formValues['/rest/encrypted/profileKey'],
      transaction_type: 'D',
      card_number: formValues['rest/encrypted/cardNumber'],
      transaction_amount: '151',
      resp_encoding: 'json',
    };

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'merchantesolutions',
      '/rest/authType': 'token',
      '/rest/mediaType': 'urlencoded',
      '/rest/baseURI': `https://cert.merchante-solutions.com`,
      '/rest/pingRelativeURI': '/mes-api/tridentApi',
      '/rest/pingMethod': 'POST',
      '/rest/pingSuccessValues': ['000'],
      '/rest/pingSuccessPath': 'error_code',
      '/rest/pingBody': JSON.stringify(pingData),
      '/rest/headers': [
        { name: 'content-type', value: 'application/x-www-form-urlencoded' },
      ],
    };
  },
  fieldMap: {
    name: { fieldId: 'name' },
    'rest.unencrypted.profileId': {
      id: 'rest.unencrypted.profileId',
      type: 'text',
      label: 'Profile ID:',
      required: true,
      helpText: 'ID (Profile ID) issued by Merchant e-Solutions.',
    },
    'rest.encrypted.profileKey': {
      id: 'rest.encrypted.profileKey',
      type: 'text',
      label: 'Profile Key:',
      required: true,
      inputType: 'password',
      helpText: 'API password (Profile Key) assigned by Merchant e-Solutions.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'rest.encrypted.cardNumber': {
      id: 'rest.encrypted.cardNumber',
      type: 'text',
      label: 'Card Number:',
      required: true,
      inputType: 'password',
      helpText: 'Payment card number.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    restAdvanced: { formId: 'restAdvanced' },
  },
  layout: {
    fields: [
      'name',
      'rest.unencrypted.profileId',
      'rest.encrypted.profileKey',
      'rest.encrypted.cardNumber',
    ],
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'Advanced Settings', fields: ['restAdvanced'] },
    ],
  },
};
