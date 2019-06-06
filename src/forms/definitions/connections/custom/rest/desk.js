export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'desk',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/api/v2/cases',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://${formValues['/rest/deskSubdomain']}'.desk.com`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      name: '/rest/deskSubdomain',
      helpKey: 'desk.subdomain',
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
    { fieldId: 'rest.basicAuth.username', helpKey: 'desk.username' },
    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'desk.password',
      inputType: 'password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
