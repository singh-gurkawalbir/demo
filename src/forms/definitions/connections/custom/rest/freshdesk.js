export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'freshdesk',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'ticket_fields.json',
    '/rest/baseURI': `https://${
      formValues['/rest/freshdeskSubdomain']
    }.freshdesk.com/`,
    '/rest/pingFailurePath': 'require_login',
    '/rest/pingFailureValues': [true],
  }),
  fields: [
    { fieldId: 'name' },
    {
      type: 'text',
      name: '/rest/freshdeskSubdomain',
      helpKey: 'freshdesk.subdomain',
      startAdornment: 'https://',
      endAdornment: '.freshdesk.com',
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
          baseUri.indexOf('.freshdesk.com')
        );

        return subdomain;
      },
    },
    { fieldId: 'rest.basicAuth.username', helpKey: 'freshdesk.username' },
    {
      fieldId: 'rest.basicAuth.password',
      inputType: 'password',
      helpKey: 'freshdesk.password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
