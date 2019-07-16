export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'chargify',
    '/rest/authType': 'custom',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'customers.json',
    '/rest/baseURI': `https://${
      formValues['/rest/chargifySubdomain']
    }.chargify.com`,
    '/rest/headers': [
      {
        name: 'Authorization',
        value:
          'Basic {{{base64Encode (join ":" connection.rest.encrypted.apiKey "x")}}}',
      },
    ],
  }),

  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      id: 'rest.chargifySubdomain',
      startAdornment: 'https://',
      helpText:
        'The subdomain of your chargify account. For example, https://mysubdomain.chargify.com.',
      endAdornment: '.chargify.com',
      label: 'Enter subdomain into the base uri',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.chargify.com')
        );

        return subdomain;
      },
    },

    {
      id: 'rest.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API key of your Chargify account.',
    },
  ],
};
