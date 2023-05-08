export const fieldMeta = {
  fieldMap: {
    ResourceType: {
      id: 'Type',
      name: 'Type',
      type: 'select',
      placeholder: 'What would you like to select?',
      visibleWhenAll: [{ field: 'application', isNot: [''] }],
      options: [
        {
          items: [
            { label: 'connections', value: 'connections' },
            { label: 'imports', value: 'imports' },
            { label: 'exports', value: 'exports' },
            { label: 'flows', value: 'flows' },
          ],
        },
      ],
      label: 'ResourceType',
      required: true,
      noApi: true,
    },
  },
  layout: {
    fields: ['ResourceType'],
  },
};
