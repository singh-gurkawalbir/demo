export default {
  optionsHandler: (fieldId, fields) => {
    if (fieldId === 'content') {
      const insertFunctionField = fields.find(
        field => field.id === 'insertFunction'
      );

      if (insertFunctionField && insertFunctionField.value) {
        return {
          scriptFunctionStub: insertFunctionField.value,
        };
      }
    }
  },
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
    insertFunction: { fieldId: 'insertFunction' },
    content: {
      fieldId: 'content',
      refreshOptionsOnChangesTo: ['insertFunction'],
    },
  },
  layout: {
    fields: ['name', 'description', 'insertFunction', 'content'],
  },
};
