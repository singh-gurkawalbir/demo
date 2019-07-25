export default {
  fields: [
    {
      id: 'rest.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API key of your Chargify account.',
    },

    {
      id: 'rest.encrypted.apiSecret',
      required: true,
      type: 'text',
      label: 'API Secret:',
      inputType: 'password',
      helpText: 'The API Secret of your Certify account.',
    },

    {
      id: 'rest.bearerToken',
      type: 'tokengen',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'rest.encrypted.apiKey',
          is: [''],
        },
        {
          field: 'rest.encrypted.apiSecret',
          is: [''],
        },
      ],
      label: 'Token Generator',
      helpText: 'The API Secret of your Certify account.',
    },

    {
      id: 'rest.siteId',
      required: true,
      type: 'text',
      label: 'Site Id',
      inputType: 'password',
      helpText: 'The API Secret of your Certify account.',
    },
  ],
};
