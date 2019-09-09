export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'chargify',
    '/http/auth/type': 'custom',
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': 'customers.json',
    '/http/ping/method': 'GET',
    '/http/baseURI': `https://${
      formValues['/http/chargifySubdomain']
    }.chargify.com`,
    '/http/headers': [
      {
        name: 'Authorization',
        value:
          'Basic {{{base64Encode (join ":" connection.http.encrypted.apiKey "x")}}}',
      },
    ],
  }),

  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      id: 'http.chargifySubdomain',
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
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.chargify.com')
          );

        return subdomain;
      },
    },

    {
      id: 'http.encrypted.apiKey',
      required: true,
      type: 'text',
      label: 'API Key:',
      inputType: 'password',
      helpText: 'The API key of your Chargify account.',
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
