export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'newegg',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.newegg.com/marketplace${
      formValues['/accountType'] === 'neweggbusiness' ? '/b2b' : ''
    }`,
    '/rest/pingRelativeURI': `/sellermgmt/seller/industry?sellerid=${
      formValues['/rest/unencrypted/sellerId']
    }`,
    '/rest/headers': [
      {
        name: 'Authorization',
        value: '{{{connection.rest.encrypted.apiKey}}}',
      },
      {
        name: 'Secretkey',
        value: '{{{connection.rest.encrypted.apiSecret}}}',
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
      label: 'Account Type:',
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
        const baseUri = r && r.rest && r.rest.baseURI;

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
      id: 'rest.encrypted.apiKey',
      type: 'text',
      label: 'API Key:',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter the unique API Key which Newegg Marketplace integration team assigned to you.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'rest.encrypted.apiSecret',
      type: 'text',
      label: 'API Key:',
      required: true,
      inputType: 'password',
      helpText:
        'Please enter the unique Secret Key which Newegg Marketplace integration team assigned to you. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your key safe.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'rest.unencrypted.sellerId',
      type: 'text',
      label: 'Seller Id:',
      required: true,
      helpText:
        'Get Seller ID from the seller/Newegg that authorized the Newegg Marketplace API Services access to you, for each seller you are integrating for.',
    },
  ],
};
