export default {
  preSubmit: formValues => ({
    ...formValues,
    '/http/auth/type': 'custom',
    '/http/baseURI': `https://api.bamboohr.com/api/gateway.php/${
      formValues['/http/bamboohrSubdomain']
    }`,
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/employees/directory',
    '/http/ping/method': 'GET',
    '/type': 'http',
    '/assistant': 'bamboohr',
    '/http/headers': [
      { name: 'Accept', value: 'application/json' },
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
      id: 'http.bamboohrSubdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.bamboohr.com',
      label: 'Subdomain:',
      helpText:
        'Please enter your team name here which you configured while signing up for a new Zendesk account.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r.http.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.bamboohr.com')
        );

        return subdomain;
      },
    },
    {
      id: 'http.encrypted.apiKey',
      label: 'API Key:',
      type: 'text',
      inputType: 'password',
      helpText:
        'Please enter your API User. Navigate to Merchant view on left hand side and click on API keys section to find API User.',
    },
  ],
};
