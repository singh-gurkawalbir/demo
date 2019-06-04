export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'chargebee',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'urlencoded',
      '/rest/basicAuth/password': '',
      '/rest/pingRelativeURI': '/v2/subscriptions',
      '/rest/pingMethod': 'GET',
      '/rest/baseURI': `https://${
        formValues['/rest/chargebeeSubdomain']
      }.chargebee.com/api`,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'chargebeeSubdomain',
      type: 'text',
      name: '/rest/chargebeeSubdomain',
      startAdornment: 'https://',
      endAdornment: '.chargebee.com/api',
      label: 'Enter subdomain into the base uri',
      validWhen: {
        matchesRegEx: {
          pattern: '^[a-zA-Z0-9]*$',
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
    { fieldId: 'rest.basicAuth.username' },
  ],
};
