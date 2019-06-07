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
      name: '/chargebeeSubdomain',
      startAdornment: 'https://',
      helpKey: 'chargebee.subdomain',
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
      required: true,
      helpKey: 'chargebee.apiKey',
    },
  ],
};
