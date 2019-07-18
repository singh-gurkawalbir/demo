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
      resourceId: r => r._id,
      required: true,
      type: 'tokengen',
      label: 'Token',
      inputType: 'password',
      helpText: 'The API Secret of your Certify account.',
    },
  ],
};
