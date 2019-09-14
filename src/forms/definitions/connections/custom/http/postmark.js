export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'postmark',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://api.postmarkapp.com/`,
    '/http/ping/relativeURI': '/servers?count=1&offset=0',
    '/http/headers': [
      { name: 'Content-Type', value: 'application/json' },
      {
        name: 'X-Postmark-Account-Token',
        value: '{{{connection.http.encrypted.accountToken}}}',
      },
    ],
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'http.encrypted.serverToken',
      label: 'Server Token',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText:
        'Please enter your Server Token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Server Token safe. Used for requests that require server level privileges. This token can be found on the Credentials tab under your Postmark server.',
      description:
        'Note: for security reasons this field must always be re-entered.',
    },
    {
      id: 'http.encrypted.accountToken',
      label: 'Account Token',
      defaultValue: '',
      type: 'text',
      inputType: 'password',
      required: true,
      helpText:
        'Please enter your Account Token here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your Account Token safe. Used for requests that require account level privileges. This token is only accessible by the account owner, and can be found on the API Tokens tab of your Postmark account.',
      description:
        'Note: for security reasons this field must always be re-entered.',
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
