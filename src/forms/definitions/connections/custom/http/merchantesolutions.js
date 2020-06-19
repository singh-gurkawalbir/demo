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
      '/http/baseURI': 'https://cert.merchante-solutions.com',
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
    },
    'http.encrypted.profileKey': {
      id: 'http.encrypted.profileKey',
      type: 'text',
      label: 'Profile key',
      required: true,
      defaultValue: '',
      inputType: 'password',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    'http.encrypted.cardNumber': {
      id: 'http.encrypted.cardNumber',
      type: 'text',
      label: 'Card number',
      required: true,
      inputType: 'password',
      defaultValue: '',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    application: {
      id: 'application',
      type: 'text',
      label: 'Application',
      defaultValue: r => r && r.assistant ? r.assistant : r.type,
      defaultDisabled: true,
    },
    httpAdvanced: { formId: 'httpAdvanced' },
  },
  layout: {
    type: 'collapse',
    containers: [
      { collapsed: true, label: 'General', fields: ['name', 'application'] },
      { collapsed: true,
        label: 'Application details',
        fields: ['http.unencrypted.profileId',
          'http.encrypted.profileKey',
          'http.encrypted.cardNumber'] },
      { collapsed: true, label: 'Advanced', fields: ['httpAdvanced'] },
    ],
  },
};
