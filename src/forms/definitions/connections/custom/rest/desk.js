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
      fieldId: 'rest.deskSubdomain',
      helpText:
        "Enter your Desk subdomain. For example, in https://mycompany.desk.com 'mycompany' is the subdomain.",
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
    {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The API Key of your Desk account.',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The password of your Desk account.',
    },
  ],
};
