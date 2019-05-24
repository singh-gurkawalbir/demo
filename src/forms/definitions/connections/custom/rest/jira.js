export default {
  // initHook: fieldMeta => { return fieldMeta=undefined}
  // preSubmitHook: formValues => { // getFormattedData
  init: fieldMeta => ({
    fields: [
      {
        id: 'injected',
        type: 'text',
        label: 'Injected field',
        placeholder: 'using init hook',
      },
      ...fieldMeta.fields,
    ],
  }),
  submit: formValues => {
    const fixedValues = {
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/',
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    // eslint-disable-next-line no-console
    console.log('jira new values', newValues);

    return newValues;
  },

  fields: [
    {
      fieldId: 'name',
    },
    {
      fieldId: 'rest.baseURI',
    },
    {
      fieldId: 'rest.basicAuth.username',
    },
    {
      id: 'Password',
      name: '/rest/basicAuth/password',
      helpKey: 'connection.rest.basicAuth.password',
      defaultValue: r => r.rest.basicAuth && r.rest.basicAuth.password,
      type: 'text',
      label: 'Password',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
