export default {
  preSubmit: formValues => {
    let headers = [];

    if (formValues['/rest/sandbox'] === 'true') {
      headers = [{ name: 'Accept-Language', value: 'en-US' }];
    }

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'pitneybowes',
      '/rest/authType': 'token',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://api${
        formValues['/rest/sandbox'] === 'true' ? '-sandbox' : ''
      }.pitneybowes.com/`,
      '/rest/tokenLocation': 'header',
      '/rest/authScheme': 'Bearer',
      '/rest/authHeader': 'Authorization',
      '/rest/pingMethod': 'GET',
      '/rest/pingRelativeURI': `${
        formValues['/rest/sandbox'] === 'true'
          ? 'shippingservices/v1/countries?originCountryCode=US&carrier=usps'
          : 'location-intelligence/geo911/v1/psap/byaddress?address=1 Global View, Troy, NY'
      }`,
      '/rest/headers': headers,
      '/rest/refreshTokenURI': `https://api${
        formValues['/rest/sandbox'] === 'true' ? '-sandbox' : ''
      }.pitneybowes.com/oauth/token`,
      '/rest/refreshTokenBody': '{"grant_type":"client_credentials"}',
      '/rest/refreshTokenMethod': 'POST',
      '/rest/refreshTokenMediaType': 'urlencoded',
      '/rest/refreshTokenHeaders': [
        {
          name: 'authorization',
          value: `basic ${window.btoa(
            `${formValues['/rest/unencrypted/apiKey']}:${
              formValues['/rest/encrypted/apiSecret']
            }`
          )}`,
        },
      ],
    };
  },
  fields: [
    {
      id: 'rest.sandbox',
      type: 'select',
      label: 'Account Type:',
      options: [
        {
          items: [
            { label: 'Locate & Identify', value: 'false' },
            { label: 'Ship', value: 'true' },
          ],
        },
      ],
      helpText: 'Select either Locate/Identity or Ship.',
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') !== -1) {
            return 'true';
          }
        }

        return 'false';
      },
    },
    {
      id: 'rest.unencrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      helpText: 'Please enter API Key of your Pitney Bowes Account.',
    },

    {
      id: 'rest.encrypted.apiSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'API Secret:',
      inputType: 'password',
      helpText:
        'Please enter API Secret of your Pitney Bowes Account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
    },
    {
      id: 'rest.bearerToken',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'rest.unencrypted.apiKey',
          is: [''],
        },
        {
          field: 'rest.encrypted.apiSecret',
          is: [''],
        },
      ],
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The access token of your Pitney Bowes account.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
