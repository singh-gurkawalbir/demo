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
    type: 'collapse',
    containers: [
      {
        collapsed: false,
        label: 'General',
        fields: ['name', 'description'],
      },
      {
        collapsed: false,
        label: 'Script content',
        fields: ['insertFunction', 'content'],
      },
    ],
  },
};
