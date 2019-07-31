export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'splunk',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'urlencoded',
    '/rest/pingRelativeURI': '/',
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
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
