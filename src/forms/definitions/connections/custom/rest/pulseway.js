export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/v2/systems',
    '/assistant': 'pulseway',
    '/type': 'rest',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
    },
    {
      fieldId: 'rest.basicAuth.username',
    },

    // ...or, we can create completely custom fields like this:
    {
      fieldId: 'rest.basicAuth.password',
      inputType: 'password',
      label: 'Password',
      helpKey: 'connection.rest.basicAuth.password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
