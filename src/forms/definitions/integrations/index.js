export default {
  fieldMap: {
    name: { fieldId: 'name' },
    description: { fieldId: 'description' },
  },
  layout: {
    type: 'box',
    containers: [
      {
        fields: ['name', 'description'],
      },
    ],
  },
  actions: [
    {
      id: 'saveandcreateflow',
    },
  ],
};
