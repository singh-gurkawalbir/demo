export default {
  preSubmit: formValues => {
    const fixedValues = {
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/v2/systems',
      '/assistant': 'pulseway',
      '/type': 'rest',
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    return newValues;
  },

  fields: [
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      defaultValue: r => r.rest.baseURI,
    },
    {
      fieldId: 'rest.basicAuth.username',
      defaultValue: r =>
        r.rest && r.rest.basicAuth && r.rest.basicAuth.username,
    },

    // ...or, we can create completely custom fields like this:
    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      type: 'text',
      inputType: 'password',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
