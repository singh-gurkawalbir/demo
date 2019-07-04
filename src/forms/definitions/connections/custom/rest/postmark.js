export default {
  preSubmit: formValues => {
    const headers = [];

    headers.push({ name: 'Content-Type', value: 'application/json' });
    headers.push({
      name: 'X-Postmark-Account-Token',
      value: '{{{connection.rest.encrypted.accountToken}}}',
    });

    return {
      ...formValues,
      '/type': 'rest',
      '/assistant': 'postmark',
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/baseURI': `https://api.postmarkapp.com/`,
      '/rest/pingRelativeURI': '/servers?count=1&offset=0',
      '/rest/headers': headers,
    };
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.serverToken',
      label: 'Server Token:',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'rest.encrypted.accountToken',
      label: 'Account Token:',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText:
        'Please enter your token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Token safe. This can be obtained by navigating to Tokens page from the options menu on the top right corner in the application.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
  ],
};
