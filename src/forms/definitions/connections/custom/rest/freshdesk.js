export default {
  preSubmit: formValues => {
    const fixedValues = {
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
    };
    const newValues = [...formValues, ...fixedValues];

    return newValues;
  },
  fields: [
    { fieldId: 'name' },
    {
      id: 'freshdeskSubdomain',
      type: 'text',
      name: '/rest/freshdeskSubdomain',
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
    { fieldId: 'rest.basicAuth.username' },
    {
      fieldId: 'rest.basicAuth.password',
    },
  ],
};
