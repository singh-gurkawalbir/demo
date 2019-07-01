export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({
      name: 'Authorization',
      value: '{{{connection.rest.encrypted.apiKey}}}',
    });
    headers.push({
      name: 'Secretkey',
      value: '{{{connection.rest.encrypted.apiSecret}}}',
    });
    headers.push({
      name: 'Content-Type',
      value: 'application/json',
    });
    headers.push({ name: 'Accept', value: 'application/json' });

    return {
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
      '/rest/headers': headers,
    };
  },
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
        'Please select your environment here. Select Sandbox if the account is created on https://staging.integrator.io. Select Production if the account is created on https://integrator.io.',
      defaultValue: r => {
        const baseUri = r.rest.baseURI;

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
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
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
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'rest.unencrypted.sellerId',
      type: 'text',
      label: 'Seller Id:',
      required: true,
    },
  ],
};
