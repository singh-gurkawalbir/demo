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
      formPayloadFn: form => {
        const apiKey = form[`/rest/encrypted/apiKey`];
        const apiSecret = form[`/rest/encrypted/apiSecret`];
        const base64EncodedToken = window.btoa(`${apiKey}:${apiSecret}`);

        return {
          base64EncodedToken,
          baseURI: 'https://api.pitneybowes.com/',
        };
      },

      label: 'Token Generator',

      tokenSetForFieldsFn: resp => ({
        'rest.bearerToken': resp && resp.access_token,
        'rest.siteId': resp && resp.clientID,
      }),

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
