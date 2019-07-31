export default {
  preSubmit: formValues => ({
    ...formValues,
    '/type': 'rest',
    '/assistant': 'anaplan',
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '1/3/workspaces',
    '/rest/baseURI': 'https://api.anaplan.com/',
  }),

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The username of your Anaplan account.',
    },

    {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The password of your Anaplan account.',
    },
    { fieldId: '_borrowConcurrencyFromConnectionId' },
    { fieldId: 'rest.concurrencyLevel' },
  ],
};
