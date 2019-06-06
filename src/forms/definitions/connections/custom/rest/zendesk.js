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
      fieldId: 'zendesk.subdomain',
      defaultValue: r => {
        const baseUri = r.rest.baseURI;
        const subdomain = baseUri.substring(
          baseUri.indexOf('https://') + 8,
          baseUri.indexOf('.zendesk.com')
        );

        return subdomain;
      },
    },
    { fieldId: 'rest.basicAuth.username' },
    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'connection.rest.basicAuth.password',
      inputType: 'password',
      label: 'Consumer Secret:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
