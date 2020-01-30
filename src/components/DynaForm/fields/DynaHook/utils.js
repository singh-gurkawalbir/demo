import { hooksList, hooksLabelMap } from '../../../../utils/hooks';

export default {
  getCreateScriptMetadata: scriptId => ({
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
      name: {
        id: 'name',
        name: 'name',
        type: 'text',
        label: 'Name',
        required: true,
      },
      description: {
        id: 'description',
        name: 'description',
        type: 'text',
        multiline: true,
        maxRows: 5,
        label: 'Description',
      },
      insertFunction: {
        id: 'insertFunction',
        name: 'insertFunction',
        type: 'select',
        label: 'Insert Function',
        options: [
          {
            items: hooksList.map(hook => ({
              label: hooksLabelMap[hook],
              value: hook,
            })),
          },
        ],
      },
      content: {
        id: 'content',
        name: 'content',
        defaultValue: {},
        type: 'scriptcontent',
        refreshOptionsOnChangesTo: ['insertFunction'],
        resourceId: scriptId,
        label: 'Edit Content',
      },
    },
    layout: {
      fields: ['name', 'description', 'insertFunction', 'content'],
    },
  }),
};
