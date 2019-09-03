export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'http',
    '/assistant': 'bamboohr',
    '/http/auth/type': 'custom',
    '/http/baseURI': `https://api.bamboohr.com/api/gateway.php/${
      formValues['/http/bamboohrSubdomain']
    }`,
    '/http/mediaType': 'json',
    '/http/ping/relativeURI': '/v1/employees/directory',
    '/http/ping/method': 'GET',
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
      startAdornment: 'https://api.bamboohr.com/api/gateway.php/',
      label: 'Subdomain:',
      helpText:
        'Please enter your company name here which you configured while signing up for a new BambooHR account.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.http && r.http.baseURI;
        const subdomain = baseUri.substr(
          'https://api.bamboohr.com/api/gateway.php/'.length
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
        'Please enter your API key here. Please note that there are multiple layers of protection in place (including AES 256 encryption) to keep your API key safe. To generate an API key for a given user, users should log in and click their name in the upper right hand corner of any page to get to the user context menu. There will be an "API Keys" option in that menu to go to the page.',
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
