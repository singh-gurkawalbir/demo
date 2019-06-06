export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'mailgun',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/domains',
    '/rest/pingMethod': 'GET',
    '/rest/baseURI': `https://api.mailgun.net/v3`,
    '/rest/basicAuth/username': 'api',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.password',
      inputType: 'password',
      label: 'API Key',
      helpKey: 'connection.rest.basicAuth.password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
