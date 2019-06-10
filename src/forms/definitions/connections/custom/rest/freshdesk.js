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
      fieldId: 'rest.freshdeskSubdomain',
      helpText:
        "Enter your Freshdesk subdomain. For example, in https://mycompany.freshdesk.com 'mycompany' is the subdomain.",
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
    {
      fieldId: 'rest.basicAuth.username',
      helpText:
        'Username can be either your Freshdesk account email used to login to your Freshdesk account, or the API key associated with your account, depending on preference.',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'The password of your Freshdesk account.',
    },
  ],
};
