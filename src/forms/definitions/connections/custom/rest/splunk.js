export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/rest/authType': 'basic',
      '/rest/mediaType': 'urlencoded',
      '/rest/pingRelativeURI': '/',
      '/type': 'rest',
      '/assistant': 'splunk',
      '/rest/pingMethod': 'GET',
      '/rest/disableStrictSSL': true,
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    return newValues;
  },

  fields: [
    { fieldId: 'name' },
    { fieldId: 'rest.baseURI' },
    {
      fieldId: 'rest.basicAuth.username',
      defaultValue: r =>
        r.rest && r.rest.basicAuth && r.rest.basicAuth.username,
    },

    // ...or, we can create completely custom fields like this:
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
