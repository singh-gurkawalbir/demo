export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '1/3/workspaces',
      '/type': 'rest',
      '/assistant': 'anaplan',
      '/rest/baseURI': 'https://api.anaplan.com/',
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    return newValues;
  },

  fields: [
    { fieldId: 'name' },
    { fieldId: 'rest.basicAuth.username' },

    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      helpKey: 'connection.rest.basicAuth.password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
