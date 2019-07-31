export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'slack',
    '/rest/authType': 'token',
    '/rest/mediaType': 'urlencoded',
    '/rest/baseURI': `https://slack.com/api`,
    '/rest/pingRelativeURI': 'api.test',
    '/rest/tokenLocation': 'url',
    '/rest/tokenParam': 'token',
    '/rest/pingSuccessPath': 'ok',
  }),
  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.bearerToken',
      required: true,
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
