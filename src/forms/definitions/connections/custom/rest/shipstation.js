export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'shipstation',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': 'carriers',
    '/rest/baseURI': `https://ssapi.shipstation.com`,
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
      label: 'API Key',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'connection.rest.basicAuth.password',
      inputType: 'password',
      label: 'API Secret:',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
