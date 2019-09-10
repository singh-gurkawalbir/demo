export default {
  preSubmit: formValues => {
    let headers = [];

    if (formValues['/http/sandbox'] === 'true') {
      headers = [{ name: 'Accept-Language', value: 'en-US' }];
    }

    return {
      ...formValues,
      '/type': 'http',
      '/assistant': 'pitneybowes',
      '/http/auth/type': 'token',
      '/http/mediaType': 'json',
      '/http/baseURI': `https://api${
        formValues['/http/sandbox'] === 'true' ? '-sandbox' : ''
      }.pitneybowes.com/`,
      '/http/auth/token/location': 'header',
      '/http/auth/token/scheme': 'Bearer',
      '/http/auth/token/headerName': 'Authorization',
      '/http/ping/method': 'GET',
      '/http/ping/relativeURI': `${
        formValues['/http/sandbox'] === 'true'
          ? 'shippingservices/v1/countries?originCountryCode=US&carrier=usps'
          : 'location-intelligence/geo911/v1/psap/byaddress?address=1 Global View, Troy, NY'
      }`,
      '/http/headers': headers,
      '/http/auth/token/refreshRelativeURI': `https://api${
        formValues['/http/sandbox'] === 'true' ? '-sandbox' : ''
      }.pitneybowes.com/oauth/token`,
      '/http/auth/token/refreshBody': '{"grant_type":"client_credentials"}',
      '/http/auth/token/refreshMethod': 'POST',
      '/http/auth/token/refreshMediaType': 'urlencoded',
      '/http/auth/token/refreshHeaders': [
        {
          name: 'authorization',
          value: `basic ${window.btoa(
            `${formValues['/http/unencrypted/apiKey']}:${
              formValues['/http/encrypted/apiSecret']
            }`
          )}`,
        },
      ],
    };
  },
  fields: [
    {
      id: 'http.sandbox',
      type: 'select',
      label: 'Account Type',
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
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('sandbox') !== -1) {
            return 'true';
          }
        }

        return 'false';
      },
    },
    {
      id: 'http.unencrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key',
      helpText: 'Please enter API Key of your Pitney Bowes Account.',
    },

    {
      id: 'http.encrypted.apiSecret',
      required: true,
      type: 'text',
      defaultValue: '',
      label: 'API Secret',
      inputType: 'password',
      helpText:
        'Please enter API Secret of your Pitney Bowes Account. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your user secret safe.',
    },
    {
      fieldId: 'http.auth.token.token',
      type: 'tokengen',
      inputType: 'password',
      resourceId: r => r._id,
      disabledWhen: [
        {
          field: 'http.unencrypted.apiKey',
          is: [''],
        },
        {
          field: 'http.encrypted.apiSecret',
          is: [''],
        },
      ],
      label: 'Token Generator',
      defaultValue: '',
      helpText: 'The access token of your Pitney Bowes account.',
    },
  ],
  fieldSets: [
    {
      header: 'Advanced Settings',
      collapsed: true,
      fields: [{ formId: 'httpAdvanced' }],
    },
  ],
};
