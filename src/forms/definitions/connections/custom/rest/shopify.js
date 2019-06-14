export default {
  fields: [
    // Fields can be referenced by their fieldDefinition key, and the
    // framework will fetch the missing values. Any values present in
    // this file override the references field's props.
    { fieldId: 'name' },
    {
      fieldId: 'rest.scope',
      assistantType: 'shopify',
    },
  ],
};
