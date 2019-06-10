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
  preSubmit: formValues => ({
    ...formValues,
    '/rest/authType': 'basic',
    '/rest/mediaType': 'json',
    '/rest/pingRelativeURI': '/',
  }),

  fields: [
    // Fields can be referenced by their fieldDefinition key, and the
    // framework will fetch the missing values. Any values present in
    // this file override the references field's props.
    { fieldId: 'name' },
    {
      fieldId: 'rest.baseURI',
      helpText:
        'The base URI for JIRA. For example, http://www.company.com/confluence',
    },
    {
      fieldId: 'rest.basicAuth.username',
      helpText: 'The username of your JIRA account.',
    },
    // ...or, we can create completely custom fields like this:
    {
      fieldId: 'rest.basicAuth.password',
      helpText: 'The password of your JIRA account.',
    },
  ],
};
