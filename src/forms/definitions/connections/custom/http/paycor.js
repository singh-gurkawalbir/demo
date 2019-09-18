export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'paycor',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/baseURI': `https://secure.paycor.com`,
    '/http/ping/relativeURI': 'Documents/api/documents/customreport',
    '/http/ping/method': 'GET',
  }),
  fields: [
    { fieldId: 'name' },

    {
      id: 'http.unencrypted.publicKey',
      type: 'text',
      label: 'Public Key:',
      helpText:
        'Please enter your public key here. Your public key identifies you to our system. This is similar to a username. You will include your public key every time you send request to Paycor. This is not secret information.',
      required: true,
    },
    {
      id: 'http.encrypted.secretKey',
      type: 'text',
      label: 'Private Key:',
      helpText:
        'Please enter your private key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your private key safe. The private key is secret and is similar to a password. Only you and Paycor should have your private key. The shared secret allows access to your sensitive data.',
      required: true,
      inputType: 'password',
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
