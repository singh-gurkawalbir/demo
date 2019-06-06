export default {
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '1/3/workspaces',
    '/type': 'rest',
    '/assistant': 'anaplan',
    '/rest/baseURI': 'https://api.anaplan.com/',
  }),

  fields: [
    { fieldId: 'name' },
    { fieldId: 'rest.basicAuth.username', helpKey: 'anaplan.username' },

    {
      fieldId: 'rest.basicAuth.password',
      inputType: 'password',
      helpKey: 'anaplan.password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
