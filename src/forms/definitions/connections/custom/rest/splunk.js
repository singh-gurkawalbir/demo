export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/',
    '/type': 'rest',
    '/assistant': 'splunk',
    '/rest/pingMethod': 'GET',
    '/rest/disableStrictSSL': true,
  }),
  fields: [
    { fieldId: 'name' },
    { fieldId: 'rest.baseURI' },
    {
      fieldId: 'rest.basicAuth.username',
    },
    {
      fieldId: 'rest.basicAuth.password',
      helpKey: 'connection.rest.basicAuth.password',
      inputType: 'password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
