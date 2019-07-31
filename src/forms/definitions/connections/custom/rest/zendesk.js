export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'zendesk',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/api/v2/users.json',
    '/rest/baseURI': `https://${formValues['/zendesk/subdomain']}.zendesk.com`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      id: 'zendesk.subdomain',
      type: 'text',
      startAdornment: 'https://',
      endAdornment: '.zendesk.com',
      label: 'Enter subdomain into the base uri',
      helpText:
        'Please enter your team name here which you configured while signing up for a new Zendesk account.',
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\S]+$',
          message: 'Subdomain should not contain spaces.',
        },
      },
      defaultValue: r => {
        const baseUri = r && r.rest && r.rest.baseURI;
        const subdomain =
          baseUri &&
          baseUri.substring(
            baseUri.indexOf('https://') + 8,
            baseUri.indexOf('.zendesk.com')
          );

        return subdomain;
      },
    },
    { fieldId: 'rest.basicAuth.username' },
    {
      fieldId: 'rest.basicAuth.password',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
