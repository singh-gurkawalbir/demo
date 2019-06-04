export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/type': 'rest',
      '/assistant': 'desk',
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/api/v2/cases',
      '/rest/pingMethod': 'GET',
      '/rest/baseURI': `https://${formValues['/rest/deskSubdomain']}'.desk.com`,
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'deskSubdomain',
      type: 'text',
      name: '/rest/deskSubdomain',
      startAdornment: 'https://',
      endAdornment: '.desk.com',
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
          baseUri.indexOf('.desk.com')
        );

        return subdomain;
      },
    },
    { fieldId: 'rest.basicAuth.username' },
    {
      fieldId: 'rest.basicAuth.password',
    },
  ],
};
