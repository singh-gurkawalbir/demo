export default {
  // This handler gets fired after the fieldMeta is merged with the master
  // field definitions and has had any js props converted to scalar values.
  // TODO: I think we need to also pass in the current resource.
  // Some default values could take some parsing or other such custom logic?
  // Lets wait for some assistants to be made and we will see...
  // This handler is called just before the form values are
  // converted to a patch-set and applied against the resource.
  // This handler can be used to add/modify the form values
  // programmatically if needed. Typical example is to add hardcoded values...
  preSubmit: formValues => {
    const headers = [];

    headers.push({
      name: 'X-API-KEY',
      value: '{{{connection.rest.encrypted.apiKey}}}',
    });
    headers.push({ name: 'Content-Type', value: 'application/json' });
    const fixedValues = {
      '/rest/authType': 'custom',
      '/rest/mediaType': 'json',
      '/rest/pingRelativeURI': '/v3/customers',
      '/type': 'rest',
      '/assistant': 'atera',
      '/rest/baseURI': 'https://app.atera.com/api',
      '/rest/headers': headers,
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

    // ...or, we can create completely custom fields like this:
    {
      id: 'apiKey',
      name: '/rest/basicAuth/password',
      helpKey: 'rest.encrypted.apiKey',
      type: 'text',
      inputType: 'password',
      label: 'API Key',
      description:
        'Note: for security reasons this field must always be re-entered.',
      required: true,
    },
  ],
};
