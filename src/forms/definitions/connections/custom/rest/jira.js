export default {
  // This handler gets fired after the fieldMeta is merged with the master
  // field definitions and has had any js props converted to scalar values.
  // TODO: I think we need to also pass in the current resource.
  // Some default values could take some parsing or other such custom logic?
  // Lets wait for some assistants to be made and we will see...
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
  // This handler is called just before the form values are
  // converted to a patch-set and applied against the resource.
  // This handler can be used to add/modify the form values
  // programmatically if needed. Typical example is to add hardcoded values...
  preSubmit: formValues => {
    const fixedValues = {
      '/rest/authType': 'basic',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/',
    };
    const newValues = {
      ...formValues,
      ...fixedValues,
    };

    return newValues;
  },

  fields: [
    // Fields can be referenced by their fieldDefinition key, and the
    // framework will fetch the missing values. Any values present in
    // this file override the references field's props.
    { fieldId: 'name' },
    { fieldId: 'rest.baseURI' },
    { fieldId: 'rest.basicAuth.username' },

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
