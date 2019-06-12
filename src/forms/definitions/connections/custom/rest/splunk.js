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
    },
  ],
};
