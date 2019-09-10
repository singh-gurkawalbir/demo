export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'newegg',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://api.newegg.com/marketplace${
      formValues['/accountType'] === 'neweggbusiness' ? '/b2b' : ''
    }`,
    '/http/ping/relativeURI': `/sellermgmt/seller/industry?sellerid=${
      formValues['/http/unencrypted/sellerId']
    }`,
    '/http/ping/method': 'GET',
    '/http/headers': [
      {
        name: 'Authorization',
        value: '{{{connection.http.encrypted.apiKey}}}',
      },
      {
        name: 'Secretkey',
        value: '{{{connection.http.encrypted.apiSecret}}}',
      },
      {
        name: 'Content-Type',
        value: 'application/json',
      },
      { name: 'Accept', value: 'application/json' },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'accountType',
      type: 'select',
      label: 'Account Type',
      options: [
        {
          items: [
            { label: 'Newegg', value: 'newegg' },
            { label: 'Newegg Business', value: 'neweggbusiness' },
          ],
        },
      ],
      helpText:
        'Select "Newegg Business" if your account is created on https://www.neweggbusiness.com. \n Select "Newegg" if your account is created on https://www.newegg.com.',
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;

        if (baseUri) {
          if (baseUri.indexOf('b2b') !== -1) {
            return 'neweggbusiness';
          }

          return 'newegg';
        }

        return 'newegg';
      },
    },
    {
      id: 'http.encrypted.apiKey',
      type: 'text',
      label: 'API Key',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter the unique API Key which Newegg Marketplace integration team assigned to you.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'http.encrypted.apiSecret',
      type: 'text',
      label: 'API Key',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter the unique Secret Key which Newegg Marketplace integration team assigned to you. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your key safe.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'http.unencrypted.sellerId',
      type: 'text',
      label: 'Seller Id',
      required: true,
      helpText:
        'Get Seller ID from the seller/Newegg that authorized the Newegg Marketplace API Services access to you, for each seller you are integrating for.',
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
