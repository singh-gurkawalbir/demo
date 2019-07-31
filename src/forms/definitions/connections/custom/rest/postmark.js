export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'postmark',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/baseURI': `https://api.postmarkapp.com/`,
    '/rest/pingRelativeURI': '/servers?count=1&offset=0',
    '/rest/headers': [
      { name: 'Content-Type', value: 'application/json' },
      {
        name: 'X-Postmark-Account-Token',
        value: '{{{connection.rest.encrypted.accountToken}}}',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'rest.encrypted.serverToken',
      label: 'Server Token:',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText:
        'Please enter your Server Token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Server Token safe. Used for requests that require server level privileges. This token can be found on the Credentials tab under your Postmark server.',
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
        'Please enter your Account Token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Account Token safe. Used for requests that require account level privileges. This token is only accessible by the account owner, and can be found on the API Tokens tab of your Postmark account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
