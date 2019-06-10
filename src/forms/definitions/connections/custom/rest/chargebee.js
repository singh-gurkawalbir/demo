export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'chargebee',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/basicAuth/password': '',
    '/rest/pingRelativeURI': '/v2/subscriptions',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://${
      formValues['/chargebeeSubdomain']
    }.chargebee.com/api`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      fieldId: 'chargebeeSubdomain',
      startAdornment: 'https://',
      helpText:
        "Enter your Chargebee subdomain. For example, in https://mycompany.chargebee.com/api 'mycompany' is the subdomain.",
      endAdornment: '.chargebee.com/api',
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
          baseUri.indexOf('.chargebee.com/api')
        );

        return subdomain;
      },
    },
    {
      fieldId: 'rest.basicAuth.username',
      label: 'API Key:',
      helpText: 'The API Key of your Chargebee account.',
    },
  ],
};
